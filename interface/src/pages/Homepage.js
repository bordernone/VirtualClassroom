import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

function Homepage() {
    const [socket] = useOutletContext();

    useEffect(() => {
        socket.on("create_classroom", (data) => {
            console.log(data);
            toast.success("Classroom created successfully");
        });

        socket.on("join_classroom", (data) => {
            console.log(data);
            toast.success("Joined classroom successfully");
        });
    }, []);

    const newClassroom = () => {
        socket.emit("create_classroom", {
            hostName: "Bishnu",
            hostPassword: "1234",
        });
    };

    const joinClassroom = () => {
        socket.emit("join_classroom", {
            classroomId: "5f6d2e61-ef7b-4987-a82a-720da63b1863",
            joinPassword: "1234",
            username: "Bishnu",
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
            </div>
        </div>
    );
}

export default Homepage;
