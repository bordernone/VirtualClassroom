import React from "react";
import Sketch from "react-p5";

import Student from "./Student";
import character_idle from "../../assets/characters/character_idle.png";
import character_arm_raised from "../../assets/characters/character_arm_raised.png";

export const StudentsCanvasHeight = 400;
export const StudentsCanvasWidth = 600;

class StudentsP5 extends React.Component {
    constructor() {
        super();
        this.characters = [];
        this.IMAGES = {};
    }

    preload = (p5) => {
        this.IMAGES.character_idle = p5.loadImage(character_idle);
        this.IMAGES.character_arm_raised = p5.loadImage(character_arm_raised);
    };

    setup = (p5, canvasParentRef) => {
        p5.createCanvas(StudentsCanvasWidth, StudentsCanvasHeight).parent(
            canvasParentRef
        );

        p5.frameRate(60);

        // Row 1
        let student1 = new Student(
            { sketch: p5, IMAGES: this.IMAGES },
            0,
            0,
            "Student 1"
        );
        let student2 = new Student(
            { sketch: p5, IMAGES: this.IMAGES },
            150,
            0,
            "Student 2"
        );
        let student3 = new Student(
            { sketch: p5, IMAGES: this.IMAGES },
            300,
            0,
            "Student 3"
        );
        let student4 = new Student(
            { sketch: p5, IMAGES: this.IMAGES },
            450,
            0,
            "Student 4"
        );

        // Row 2
        let student5 = new Student(
            { sketch: p5, IMAGES: this.IMAGES },
            0,
            150,
            "Student 5"
        );
        let student6 = new Student(
            { sketch: p5, IMAGES: this.IMAGES },
            150,
            150,
            "Student 6"
        );
        let student7 = new Student(
            { sketch: p5, IMAGES: this.IMAGES },
            300,
            150,
            "Student 7"
        );
        let student8 = new Student(
            { sketch: p5, IMAGES: this.IMAGES },
            450,
            150,
            "Student 8"
        );

        this.characters.push(student1);
        this.characters.push(student2);
        this.characters.push(student3);
        this.characters.push(student4);
        this.characters.push(student5);
        this.characters.push(student6);
        this.characters.push(student7);
        this.characters.push(student8);

        this.characters[0].raiseArm();
    };

    draw = (p5) => {
        p5.background(255);

        this.characters.forEach((character) => {
            character.draw();
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
