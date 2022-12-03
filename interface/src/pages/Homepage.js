import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Homepage() {
    const [socket] = useOutletContext();
    const navigate = useNavigate();

    const [showSuccess, setShowSuccess] = React.useState(false);
    const [successText, setSuccessText] = React.useState("");

    const [showJoinForm, setShowJoinForm] = React.useState(false);

    useEffect(() => {
        socket.on("create_classroom", (data) => {
            console.log(data);
            setSuccessText(data);
            setShowSuccess(true);
            toast.success("Classroom created successfully");
        });

        socket.on("join_classroom", (data) => {
            console.log(data);
            toast.success("Joined classroom successfully. Redirecting...");

            setTimeout(() => {
                let url = `/classroom/${data.classroomId}`;
                navigate(url, {
                    state: data,
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
                        className="btn btn-primary"
                        onClick={() => setShowJoinForm(!showJoinForm)}
                    >
                        Join Classroom
                    </a>
                </div>

                <div>
                    <div
                        className={
                            "mt-4 alert alert-success " +
                            (!showSuccess ? "d-none" : "")
                        }
                        role="alert"
                    >
                        {<pre>{JSON.stringify(successText, null, 2)}</pre>}
                    </div>
                </div>

                <div className="col-sm-6">
                    <div
                        className={
                            "container px-5 my-5 " +
                            (showJoinForm ? "" : "d-none")
                        }
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
                                    Enter classroom join password
                                </label>
                            </div>
                            <div className="d-grid">
                                <button
                                    className="btn btn-primary btn-lg"
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
