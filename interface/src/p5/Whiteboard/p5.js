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

        this.toolbarHeight = 40;
        this.toolbarWidth = WhiteboardCanvasWidth;
        this.toolbarX = 0;
        this.toolbarY = 0;
        this.label = "Whiteboard";

        this.clearBtnHeight = 30;
        this.clearBtnWidth = 100;
        this.clearBtnX = this.toolbarWidth - this.clearBtnWidth;
        this.clearBtnY = this.toolbarHeight / 2 - this.clearBtnHeight / 2;
        this.clearBtnLabel = "Clear";
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

        this.socket.on("clear_whiteboard", (data) => {
            console.log("clearing whiteboard");
            this.clearWhiteboard(p5);
        });

        this.drawToolBar(p5);
    };

    draw = (p5) => {
        // Draw on mouse press
        if (
            this.state.host &&
            p5.mouseIsPressed &&
            p5.mouseX > 0 &&
            p5.mouseX < WhiteboardCanvasWidth &&
            p5.mouseY > this.toolbarHeight &&
            p5.mouseY < WhiteboardCanvasHeight
        ) {
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

        // Check if the clear button is pressed
        if (
            this.state.host &&
            p5.mouseIsPressed &&
            p5.mouseX > this.clearBtnX &&
            p5.mouseX < this.clearBtnX + this.clearBtnWidth &&
            p5.mouseY > this.clearBtnY &&
            p5.mouseY < this.clearBtnY + this.clearBtnHeight
        ) {
            console.log(
                this.state.username,
                this.state.joinPassword,
                this.state.classroomId
            );
            this.socket.emit("clear_whiteboard", {
                hostName: this.state.username,
                hostPassword: this.state.joinPassword,
                classroomId: this.state.classroomId,
            });
        }
    };

    drawToolBar = (p5) => {
        p5.stroke(0);
        p5.strokeWeight(1);
        p5.fill(255);
        p5.rect(
            this.toolbarX,
            this.toolbarY,
            this.toolbarWidth,
            this.toolbarHeight
        );

        p5.fill(0);
        p5.textSize(20);
        p5.text(this.label, this.toolbarX + 10, this.toolbarY + 30);

        // Draw the clear button
        if (this.state.host) {
            p5.stroke(0);
            p5.strokeWeight(1);
            p5.fill(255);
            p5.rect(
                this.clearBtnX,
                this.clearBtnY,
                this.clearBtnWidth,
                this.clearBtnHeight
            );

            p5.fill(0);
            p5.textSize(20);
            p5.text(
                this.clearBtnLabel,
                this.clearBtnX + 10,
                this.clearBtnY + 20
            );
        }
    };

    clearWhiteboard = (p5) => {
        p5.background(255);

        // Draw the toolbar again
        this.drawToolBar(p5);
    };

    render() {
        return <Sketch setup={this.setup} draw={this.draw} />;
    }
}

export default WhiteboardP5;
