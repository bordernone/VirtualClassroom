import { Buffer } from "buffer";
import React, { useEffect } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Accordion from "react-bootstrap/Accordion";

import "../css/Homepage.css";

function Homepage() {
    const [socket] = useOutletContext();
    const navigate = useNavigate();

    const [showSuccess, setShowSuccess] = React.useState(false);
    const [successText, setSuccessText] = React.useState("");

    const [showJoinForm, setShowJoinForm] = React.useState(false);

    const [shareLinkText, setShareLinkText] = React.useState("Copy Link");

    const [username, setUsername] = React.useState("");
    const [joinPassword, setJoinPassword] = React.useState("");
    const [classroomId, setClassroomId] = React.useState("");

    const [publicJoinPassword, setPublicJoinPassword] = React.useState(null);
    const publicJoinPasswordRef = React.useRef(publicJoinPassword);

    useEffect(() => {
        socket.on("create_classroom", (data) => {
            console.log("create ", data);
            setClassroomId(data.classroomId);
            setSuccessText(data);
            setShowSuccess(true);
            setPublicJoinPassword(data.joinPassword);
            publicJoinPasswordRef.current = data.joinPassword;
            toast.success("Classroom created successfully");
        });

        socket.on("join_classroom", (data) => {
            console.log(data);
            toast.success("Joined classroom successfully. Redirecting...");
            let publicJoinPassword_ = publicJoinPasswordRef.current;
            setTimeout(() => {
                let url = `/classroom/${data.classroomId}`;
                navigate(url, {
                    state: { ...data, publicJoinPassword: publicJoinPassword_ },
                });
            }, 2000);
        });

        return () => {
            socket.off("create_classroom");
            socket.off("join_classroom");
        };
    }, []);

    const newClassroom = () => {
        let hostName = prompt("Enter your name");
        let hostPassword = prompt("Enter a master password");

        setUsername(hostName);
        setJoinPassword(hostPassword);

        socket.emit("create_classroom", {
            hostName,
            hostPassword,
        });
    };

    const joinClassroom = (username, classroomId, joinPassword) => {
        socket.emit("join_classroom", {
            username,
            classroomId,
            joinPassword,
        });
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        let username = e.target.username.value;
        let classroomId = e.target.classroomId.value;
        let joinPassword = e.target.joinPassword.value;

        joinClassroom(username, classroomId, joinPassword);
    };

    const getShareableLink = () => {
        return (
            `${window.location.origin}/classroom/` +
            successText.classroomId +
            "?joinPassword=" +
            Buffer.from(successText.joinPassword).toString("base64")
        );
    };

    return (
        <div className="container">
            <div className="main-text text-center pt-5">
                <h1>VirtualClassroom</h1>
            </div>
            <div className="sub-text text-center">
                <h3>Simple Classroom Simulation App</h3>
            </div>

            <div className="action-buttons row justify-content-center p-5">
                <div className="col-2">
                    <a
                        href="#!"
                        className="btn btn-primary"
                        onClick={newClassroom}
                    >
                        New Classroom
                    </a>
                </div>
                <div className="col-2">
                    <a
                        href="#!"
                        className="btn btn-secondary"
                        onClick={() => setShowJoinForm(!showJoinForm)}
                    >
                        Join Classroom
                    </a>
                </div>
            </div>

            <div>
                {successText.classroomId && (
                    <div className="row justify-content-center p-5">
                        <div className="justify-content-center d-flex">
                            <div className="col-2">
                                <button
                                    type="button"
                                    className="btn btn-labeled btn-dark"
                                    onClick={() => {
                                        joinClassroom(
                                            username,
                                            classroomId,
                                            joinPassword
                                        );
                                    }}
                                >
                                    <span className="btn-label">
                                        <i className="fa fa-chevron-right" />
                                    </span>
                                    Start Now
                                </button>
                            </div>
                            <div className="col-2">
                                <button
                                    type="button"
                                    className="btn btn-labeled  btn-outline-secondary"
                                    onClick={() => {
                                        setShareLinkText("Copied!");
                                        navigator.clipboard.writeText(
                                            getShareableLink()
                                        );
                                        setTimeout(() => {
                                            setShareLinkText("Copy Link");
                                        }, 2000);
                                    }}
                                >
                                    <span className="btn-label">
                                        <i className="fa fa-copy" />
                                    </span>
                                    {shareLinkText}
                                </button>
                            </div>
                        </div>
                        <div className="justify-content-center d-flex text-center">
                            <div>
                                Join as participant:{" "}
                                <small>
                                    (share this link with participants)
                                </small>
                                <CopyBlock
                                    text={getShareableLink()}
                                    codeBlock
                                    theme={dracula}
                                    showLineNumbers={false}
                                />
                            </div>
                        </div>
                    </div>
                )}
                <div className={!showSuccess ? "d-none" : ""}>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Show Details</Accordion.Header>
                            <Accordion.Body>
                                <div
                                    className={"mt-4 alert alert-success "}
                                    role="alert"
                                >
                                    {
                                        <pre>
                                            {JSON.stringify(
                                                successText,
                                                null,
                                                2
                                            )}
                                        </pre>
                                    }
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>

                <div className="row justify-content-center">
                    <div
                        className={"col-sm-6 " + (showJoinForm ? "" : "d-none")}
                    >
                        <form id="contactForm" onSubmit={onFormSubmit}>
                            <div className="form-floating mb-3">
                                <input
                                    className="form-control"
                                    id="username"
                                    type="text"
                                    placeholder="Enter your name"
                                    required
                                />
                                <label htmlFor="username">
                                    Enter your name
                                </label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    className="form-control"
                                    id="classroomId"
                                    type="text"
                                    placeholder="Enter classroom id"
                                    required
                                />
                                <label htmlFor="classroomId">
                                    Enter classroom id
                                </label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    className="form-control"
                                    id="joinPassword"
                                    type="text"
                                    placeholder="Enter classroom join password"
                                    required
                                />
                                <label htmlFor="joinPassword">
                                    Enter classroom password
                                </label>
                            </div>
                            <div className="d-grid">
                                <button
                                    className="btn btn-success btn-lg"
                                    id="submitButton"
                                    type="submit"
                                >
                                    Join Classroom
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
