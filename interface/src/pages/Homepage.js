import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Homepage() {
    const [socket] = useOutletContext();
    const navigate = useNavigate();

    const [showSuccess, setShowSuccess] = React.useState(false);
    const [successText, setSuccessText] = React.useState("");

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

    const joinClassroom = () => {
        let username = prompt("Enter your name");
        let classroomId = prompt("Enter the classroom ID");
        let joinPassword = prompt("Enter the join password");

        socket.emit("join_classroom", {
            username,
            classroomId,
            joinPassword,
        });
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
                        onClick={joinClassroom}
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
            </div>
        </div>
    );
}

export default Homepage;
