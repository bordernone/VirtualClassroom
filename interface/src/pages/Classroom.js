import React from "react";
import StudentsP5, {
    StudentsCanvasWidth,
    StudentsCanvasHeight,
} from "../p5/Student/p5";
import WhiteboardP5, {
    WhiteboardCanvasHeight,
    WhiteboardCanvasWidth,
} from "../p5/Whiteboard/p5";

function Classroom() {
    return (
        <div className="row pt-5 pb-5">
            <div
                className="col-sm-6"
                style={{
                    width: `${StudentsCanvasWidth}px`,
                    height: `${StudentsCanvasHeight}px`,
                    boxSizing: "content-box",
                }}
            >
                <StudentsP5 />
            </div>

            <div
                className="col-sm-6 border-gradient border-gradient-purple"
                style={{
                    width: `${WhiteboardCanvasWidth}px`,
                    height: `${WhiteboardCanvasHeight}px`,
                    boxSizing: "content-box",
                }}
            >
                <WhiteboardP5 />
            </div>
        </div>
    );
}

export default Classroom;
