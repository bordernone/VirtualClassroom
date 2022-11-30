import React from "react";
import Sketch from "react-p5";

export const WhiteboardCanvasHeight = 400;
export const WhiteboardCanvasWidth = 600;

class WhiteboardP5 extends React.Component {
    constructor() {
        super();
    }

    setup = (p5, canvasParentRef) => {
        p5.createCanvas(WhiteboardCanvasWidth, WhiteboardCanvasHeight).parent(
            canvasParentRef
        );

        p5.frameRate(60);
    };

    draw = (p5) => {
        p5.background(255);
    };

    render() {
        return <Sketch setup={this.setup} draw={this.draw} />;
    }
}

export default WhiteboardP5;
