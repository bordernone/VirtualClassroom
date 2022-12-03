import React from "react";
import Sketch from "react-p5";

export const WhiteboardCanvasHeight = 400;
export const WhiteboardCanvasWidth = 600;

class WhiteboardP5 extends React.Component {
    constructor(props) {
        super(props);

        this.socket = props.socket;
        this.state = props.state;

        this.strokeWeight = 4;
        this.color = "black";
    }

    setup = (p5, canvasParentRef) => {
        p5.createCanvas(WhiteboardCanvasWidth, WhiteboardCanvasHeight).parent(
            canvasParentRef
        );

        p5.frameRate(60);
        p5.background(255);

        this.socket.on("draw_whiteboard", (data) => {
            p5.stroke(data.color);
            p5.strokeWeight(data.size);
            p5.line(data.pmouseX, data.pmouseY, data.mouseX, data.mouseY);
        });
    };

    draw = (p5) => {
        // Draw on mouse press
        if (this.state.host && p5.mouseIsPressed && p5.mouseX > 0 && p5.mouseX < WhiteboardCanvasWidth && p5.mouseY > 0 && p5.mouseY < WhiteboardCanvasHeight) {
            this.socket.emit("draw_whiteboard", {
                mouseX: p5.mouseX,
                mouseY: p5.mouseY,
                pmouseX: p5.pmouseX,
                pmouseY: p5.pmouseY,
                color: this.color,
                size: this.strokeWeight,
                hostName: this.state.username,
                hostPassword: this.state.joinPassword,
                classroomId: this.state.classroomId,
            });
        }
    };

    render() {
        return <Sketch setup={this.setup} draw={this.draw} />;
    }
}

export default WhiteboardP5;
