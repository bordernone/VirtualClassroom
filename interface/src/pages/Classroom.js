import { Buffer } from "buffer";
import React, { useEffect } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import {
    useLocation,
    useOutletContext,
    useParams,
    useSearchParams,
} from "react-router-dom";
import StudentsP5, {
    StudentsCanvasHeight,
    StudentsCanvasWidth,
} from "../p5/Student/p5";
import WhiteboardP5, {
    WhiteboardCanvasHeight,
    WhiteboardCanvasWidth,
} from "../p5/Whiteboard/p5";

function Classroom() {
    const [socket] = useOutletContext();
    const { state } = useLocation();

    const [searchParams, setSearchParams] = useSearchParams();
    const { classroomId } = useParams();

    const [data, setData] = React.useState(state);

    useEffect(() => {
        if (!state) {
            let joinPassword = searchParams.get("joinPassword");
            // Buffer decode
            joinPassword = Buffer.from(joinPassword, "base64").toString(
                "ascii"
            );

            let username = prompt("Enter your name");

            socket.emit("join_classroom", {
                username,
                classroomId,
                joinPassword,
            });
        }
    }, [searchParams]);

    useEffect(() => {
        socket.on("join_classroom", (data) => {
            setData(data);
        });

        return () => {
            socket.off("join_classroom");
        };
    }, []);

    const getShareableLink = () => {
        if (!data) return "";
        let joinPassword;
        if (data.host) {
            joinPassword = data.publicJoinPassword;
        } else {
            joinPassword = data.joinPassword;
        }
        // Buffer encode
        joinPassword = Buffer.from(joinPassword).toString("base64");

        return `${window.location.origin}/classroom/${data.classroomId}?joinPassword=${joinPassword}`;
    };

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
                {data && <StudentsP5 socket={socket} state={data} />}
            </div>

            <div
                className="col-sm-6 border-gradient border-gradient-purple p-0"
                style={{
                    width: `${WhiteboardCanvasWidth}px`,
                    height: `${WhiteboardCanvasHeight}px`,
                    boxSizing: "content-box",
                }}
            >
                {data && <WhiteboardP5 socket={socket} state={data} />}

                <div className="code-block-wrapper mt-1">
                    <label>Share Link:</label>
                    <CopyBlock
                        text={getShareableLink()}
                        codeBlock
                        theme={dracula}
                        showLineNumbers={false}
                    />
                </div>
            </div>
        </div>
    );
}

export default Classroom;
