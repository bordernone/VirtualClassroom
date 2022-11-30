import React from "react";

function Homepage() {
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
                    <a href="/login" className="btn btn-primary">
                        New Classroom
                    </a>
                </div>
                <div className="col-2">
                    <a href="/register" className="btn btn-primary">
                        Join Classroom
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
