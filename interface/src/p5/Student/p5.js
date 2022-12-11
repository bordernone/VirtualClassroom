import React from "react";
import Sketch from "react-p5";
import * as ml5 from "ml5";
import LoadingOverlay from "react-loading-overlay";

import Student from "./Student";
import character_idle from "../../assets/characters/character_idle.png";
import character_arm_raised from "../../assets/characters/character_arm_raised.png";

LoadingOverlay.propTypes = undefined;

export const StudentsCanvasHeight = 400;
export const StudentsCanvasWidth = 600;

class StudentsP5 extends React.Component {
    constructor(props) {
        super(props);

        this.p5 = null;

        this.videoRef = React.createRef();
        this.poseNet = null;
        this.posesHistory = [];

        this.characters = [];
        this.IMAGES = {};
        this.characterArmRaised = false;

        this.ping = null;

        this.socket = this.props.socket;
        this.state = { ...this.props.state, loading: true };

        this.studentsData = [];

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

        this.setupPoseNet(this.p5);

        window.addEventListener("arm_status_change", this.onArmStatusChange);
    }

    componentWillUnmount() {
        this.poseNet.removeListener("pose", this.onPoseNet);
        this.socket.off("students_update");
        clearInterval(this.ping);
    }

    setupPoseNet = (p5) => {
        const video = this.videoRef.current;

        var facingMode = "user"; // 'user' for the front camera or 'environment' for the back camera
        var constraints = {
            audio: false, // Audio is not required.
            video: {
                facingMode: facingMode,
            },
        };

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function success(stream) {
                video.srcObject = stream;
            });

        this.poseNet = ml5.poseNet(video, () => {
            console.log("Model loaded!");

            // Ping the server to get the students data, after model has loaded
            this.socket.emit("students_update", {
                classroomId: this.state.classroomId,
            });

            let _this = this;
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
        if (poses.length > 0) {
            this.posesHistory.push(poses[0].pose);
        }

        poses = this.posesHistory;

        // last 5 poses
        const n = 5;
        if (poses.length >= n) {
            // take the last n
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

    isArmRaised = (pose) => {
        return this.leftArmRaised(pose) || this.rightArmRaised(pose);
    };

    leftArmRaised = (pose) => {
        let leftWrist = pose.leftWrist;
        let leftShoulder = pose.leftShoulder;

        if (leftWrist.confidence > 0.2 && leftShoulder.confidence > 0.2) {
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

        if (rightWrist.confidence > 0.2 && rightShoulder.confidence > 0.2) {
            let rightWristY = rightWrist.y;
            let rightShoulderY = rightShoulder.y;

            if (rightWristY < rightShoulderY) {
                return true;
            }
        }

        return false;
    };

    isLookingAtScreen = (pose) => {
        let leftEye = pose.leftEye;
        let rightEye = pose.rightEye;

        if (leftEye.confidence > 0.2 && rightEye.confidence > 0.2) {
            let leftEyeX = leftEye.x;
            let rightEyeX = rightEye.x;

            if (leftEyeX > rightEyeX) {
                return true;
            }
        }

        return false;
    };

    onArmStatusChange = (e) => {
        let isRaised = e.detail.isRaised;
        console.log("isRaised:", isRaised);
        this.socket.emit("update_arm_status", {
            armRaised: isRaised,
        });
    };

    setupCharacters = (p5) => {
        let _this = this;
        let characters = [];
        for (let i = 0; i < _this.state.studentsData.length; i++) {
            let student = _this.state.studentsData[i];
            let character = new Student(
                { sketch: p5, IMAGES: _this.IMAGES },
                _this.POSITIONS[i][0],
                _this.POSITIONS[i][1],
                student.data.user
            );
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

        this.characters.forEach((character) => {
            try {
                character.draw();
            } catch (e) {
                // console.log(e);
            }
        });
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
