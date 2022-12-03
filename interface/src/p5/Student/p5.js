import React from "react";
import Sketch from "react-p5";

import Student from "./Student";
import character_idle from "../../assets/characters/character_idle.png";
import character_arm_raised from "../../assets/characters/character_arm_raised.png";

export const StudentsCanvasHeight = 400;
export const StudentsCanvasWidth = 600;

class StudentsP5 extends React.Component {
    constructor(props) {
        super(props);

        this.p5 = null;

        this.characters = [];
        this.IMAGES = {};

        this.socket = this.props.socket;
        this.state = this.props.state;

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

        // Ping the server to get the students data
        this.socket.emit("students_update", {
            classroomId: this.state.classroomId,
        });
        this.listener = setInterval(() => {
            this.socket.emit("students_update", {
                classroomId: this.state.classroomId,
            });
        }, 5000);
    }

    componentWillUnmount() {
        this.socket.off("students_update");
        clearInterval(this.listener);
    }

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
            <Sketch
                setup={this.setup}
                draw={this.draw}
                preload={this.preload}
            />
        );
    }
}

export default StudentsP5;
