import * as ml5 from "ml5";
import React from "react";
import LoadingOverlay from "react-loading-overlay";
import Sketch from "react-p5";

import character_arm_raised from "../../assets/characters/character_arm_raised.png";
import character_idle from "../../assets/characters/character_idle.png";
import Student from "./Student";

LoadingOverlay.propTypes = undefined;

export const StudentsCanvasHeight = 400;
export const StudentsCanvasWidth = 500;

export const MIN_Confidence = 0.5;

class StudentsP5 extends React.Component {
    constructor(props) {
        super(props);

        this.p5 = null;

        this.videoRef = React.createRef();
        this.poseNet = null;
        this.posesHistory = [];
        this.characters = [];
        this.IMAGES = {};
        this.characterPresent = false;
        this.characterArmRaised = false;

        this.ping = null;

        this.socket = this.props.socket;
        this.state = { ...this.props.state, loading: true };

        // Hardcoded positions for the characters
        this.POSITIONS = [
            [0, 0],
            [150, 0],
            [300, 0],
            [450, 0],
            [0, 150],
            [150, 150],
            [300, 150],
            [450, 150],
        ];
    }

    componentDidMount() {
        let _this = this;
        // Listen for students update
        this.socket.on("students_update", (data) => {
            console.log("students_update", data);
            // Set the students data with callback
            this.setState(
                {
                    studentsData: data,
                },
                () => {
                    // Update the characters
                    _this.setupCharacters(_this.p5);
                }
            );
        });

        //  setup poseNet
        this.setupPoseNet(this.p5);

        // Listen for arm status change and presence change
        window.addEventListener("arm_status_change", this.onArmStatusChange);
        window.addEventListener(
            "presence_status_change",
            this.onPresenceStatusChange
        );
    }

    componentWillUnmount() {
        // Remove the event listeners
        this.poseNet.removeListener("pose", this.onPoseNet);
        this.socket.off("students_update");
        clearInterval(this.ping);
    }

    setupPoseNet = (p5) => {
        const video = this.videoRef.current;
        // Setup the video
        var facingMode = "user"; // 'user' for the front camera or 'environment' for the back camera
        var constraints = {
            audio: false, // Audio is not required.
            video: {
                facingMode: facingMode,
            },
        };

        // Get the video stream
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function success(stream) {
                video.srcObject = stream;
            });

        // Setup the poseNet model
        this.poseNet = ml5.poseNet(video, () => {
            console.log("Model loaded!");

            // Ping the server to get the students data, after model has loaded
            this.socket.emit("students_update", {
                classroomId: this.state.classroomId,
            });

            let _this = this;
            // Ping the server every second to get the students data
            this.ping = setInterval(() => {
                _this.socket.emit("students_update", {
                    classroomId: _this.state.classroomId,
                });
            }, 1000);

            this.setState({ loading: false });
        });

        this.poseNet.on("pose", this.onPoseNet);
    };

    onPoseNet = (poses) => {
        // Add the pose to the history
        if (poses.length > 0) {
            this.posesHistory.push(poses[0].pose);
        }

        // Keep the history to 10 poses
        if (this.posesHistory.length > 10) {
            this.posesHistory.shift();
        }
        poses = this.posesHistory;

        // if not host
        if (!this.state.isHost) {
            this.detectArmStatusChange(poses);
        }
        this.detectPresence(poses);
    };

    detectArmStatusChange = (poses) => {
        // last 5 poses
        const n = 5;
        if (poses.length >= n) {
            // Get the last n poses
            poses = poses.slice(poses.length - n, poses.length);

            let raised = true;
            for (const pose of poses) {
                if (!(this.isArmRaised(pose) && this.isLookingAtScreen(pose))) {
                    raised = false;
                    break;
                }
            }

            if (raised && !this.characterArmRaised) {
                this.characterArmRaised = true;
                // Dispatch the arm raised event
                const event = new CustomEvent("arm_status_change", {
                    detail: {
                        isRaised: true,
                    },
                });
                window.dispatchEvent(event);
                return;
            }

            raised = false;
            for (const pose of poses) {
                if (this.isArmRaised(pose) && this.isLookingAtScreen(pose)) {
                    raised = true;
                    break;
                }
            }

            if (!raised && this.characterArmRaised) {
                this.characterArmRaised = false;
                // Dispatch the arm raised event
                const event = new CustomEvent("arm_status_change", {
                    detail: {
                        isRaised: false,
                    },
                });
                window.dispatchEvent(event);
                return;
            }
        }
    };

    detectPresence = (poses) => {
        let n = 5;
        if (poses.length > n) {
            // Get the last n poses
            poses = poses.slice(poses.length - n, poses.length);
            // Check if nose or shoulders are visible
            let characterPresent = true;
            // console.log(poses[0]);
            for (const pose of poses) {
                if (
                    pose.leftShoulder.confidence < MIN_Confidence &&
                    pose.rightShoulder.confidence < MIN_Confidence
                ) {
                    characterPresent = false;
                    break;
                }
            }

            if (characterPresent && !this.characterPresent) {
                this.characterPresent = true;
                // Dispatch the arm raised event
                const event = new CustomEvent("presence_status_change", {
                    detail: {
                        isPresent: true,
                    },
                });
                window.dispatchEvent(event);
                return;
            }

            if (!characterPresent && this.characterPresent) {
                this.characterPresent = false;
                // Dispatch the arm raised event
                const event = new CustomEvent("presence_status_change", {
                    detail: {
                        isPresent: false,
                    },
                });
                window.dispatchEvent(event);
                return;
            }
        }
        return false;
    };

    isArmRaised = (pose) => {
        return this.leftArmRaised(pose) || this.rightArmRaised(pose);
    };

    leftArmRaised = (pose) => {
        let leftWrist = pose.leftWrist;
        let leftShoulder = pose.leftShoulder;
        // Check if the left wrist is above the left shoulder
        if (
            leftWrist.confidence > MIN_Confidence &&
            leftShoulder.confidence > MIN_Confidence
        ) {
            let leftWristY = leftWrist.y;
            let leftShoulderY = leftShoulder.y;

            if (leftWristY < leftShoulderY) {
                return true;
            }
        }

        return false;
    };

    rightArmRaised = (pose) => {
        let rightWrist = pose.rightWrist;
        let rightShoulder = pose.rightShoulder;

        // Check if the right wrist is above the right shoulder
        if (
            rightWrist.confidence > MIN_Confidence &&
            rightShoulder.confidence > MIN_Confidence
        ) {
            let rightWristY = rightWrist.y;
            let rightShoulderY = rightShoulder.y;

            if (rightWristY < rightShoulderY) {
                return true;
            }
        }

        return false;
    };

    // Add in future versions
    isLookingAtScreen = (pose) => {
        return true;
        // TODO: Add in future versions. The following code is not working properly
        // let leftEye = pose.leftEye;
        // let rightEye = pose.rightEye;

        // if (leftEye.confidence > MIN_Confidence && rightEye.confidence > MIN_Confidence) {
        //     let leftEyeX = leftEye.x;
        //     let rightEyeX = rightEye.x;

        //     if (leftEyeX > rightEyeX) {
        //         return true;
        //     }
        // }

        // return false;
    };

    onArmStatusChange = (e) => {
        let isRaised = e.detail.isRaised;
        console.log("isRaised:", isRaised);
        // Update the arm status when the arm is raised
        this.socket.emit("update_status", {
            armRaised: isRaised,
            isPresent: this.characterPresent,
        });
    };

    onPresenceStatusChange = (e) => {
        let isPresent = e.detail.isPresent;
        console.log("isPresent:", isPresent);
        // Update the arm status when the presence status changes
        this.socket.emit("update_status", {
            isPresent: isPresent,
            armRaised: this.characterArmRaised,
        });
    };

    // Load the character images
    setupCharacters = (p5) => {
        let _this = this;
        let characters = [];

        let studentsData = this.state.studentsData;
        // Filter out the host and the students who are not present
        studentsData = studentsData.filter((student) => {
            return student.data.isHost === false && student.data.isPresent;
        });

        // Create the characters
        for (let i = 0; i < studentsData.length; i++) {
            let student = studentsData[i];
            // Create the character using hard-coded positions
            let character = new Student(
                { sketch: p5, IMAGES: _this.IMAGES },
                _this.POSITIONS[i][0],
                _this.POSITIONS[i][1],
                student.data.user
            );
            // Set the arm raised status
            if (student.data.armRaised) {
                character.raiseArm();
            }
            characters.push(character);
        }

        this.characters = characters;
    };

    preload = (p5) => {
        this.IMAGES.character_idle = p5.loadImage(character_idle);
        this.IMAGES.character_arm_raised = p5.loadImage(character_arm_raised);
    };

    setup = (p5, canvasParentRef) => {
        this.p5 = p5;

        p5.createCanvas(StudentsCanvasWidth, StudentsCanvasHeight).parent(
            canvasParentRef
        );

        p5.frameRate(60);
    };

    draw = (p5) => {
        p5.background(255);
        // Fill black
        p5.fill(0);
        this.characters.forEach((character) => {
            try {
                character.draw();
            } catch (e) {
                // console.log(e);
            }
        });

        // Draw the host present text: whether the host is present or not
        this.drawHostPresentText(p5);
    };

    drawHostPresentText = (p5) => {
        // Draw gray circle if host is not present
        if (!this.isHostPresent()) {
            p5.fill(200);
            p5.circle(StudentsCanvasWidth - 10, 10, 10);
        } else {
            // Draw green circle if host is present
            p5.fill(0, 255, 0);
            p5.circle(StudentsCanvasWidth - 10, 10, 10);
        }
    };

    isHostPresent = () => {
        // Find the host
        let host = this.state.studentsData?.find((student) => {
            return student.data.isHost;
        });
        // Return true if the host is present
        return !!host;
    };

    render() {
        return (
            <>
                <LoadingOverlay
                    active={this.state.loading}
                    spinner
                    text="Loading..."
                >
                    <Sketch
                        setup={this.setup}
                        draw={this.draw}
                        preload={this.preload}
                    />
                    <video
                        autoPlay
                        id="video"
                        ref={this.videoRef}
                        height="300"
                        width="300"
                        className="d-none"
                    ></video>
                </LoadingOverlay>
            </>
        );
    }
}

export default StudentsP5;
