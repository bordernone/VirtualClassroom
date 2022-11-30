const { Classroom } = require("../models/init");

const join_classroom = (io, socket, classroomId, joinPassword) => {
    if (classroomId && joinPassword) {
        // Get the classroom
        Classroom.findOne({
            where: {
                id: classroomId,
                joinPassword: joinPassword,
            },
        })
            .then((classroom) => {
                if (classroom) {
                    // Check number of students in the socket room
                    const room = io.sockets.adapter.rooms[classroomId];
                    if (room && room.length >= 2) {
                        socket.join(classroomId);
                        console.log("Joined Classroom: ", classroomId);
                        socket.emit("join_classroom", {
                            success: true,
                            message: "Joined Classroom",
                        });
                    } else {
                        socket.emit("Error", "Classroom is full or hasn't started");
                        console.log("Classroom is full");
                    }
                } else {
                    socket.emit(
                        "Error",
                        "Invalid Classroom ID or Join Password"
                    );
                }
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        socket.emit("Error", "Invalid Classroom ID or Join Password");
    }
};

const start_classroom = (io, socket, classroomId, hostPassword) => {
    if (classroomId && hostPassword) {
        // Get the classroom
        Classroom.findOne({
            where: {
                id: classroomId,
                hostPassword: hostPassword,
            },
        })
            .then((classroom) => {
                if (classroom) {
                    socket.join(classroomId);
                    console.log("Started Classroom: ", classroomId);
                    socket.emit("start_classroom", {
                        success: true,
                        message: "Started Classroom",
                    });
                } else {
                    socket.emit(
                        "Error",
                        "Invalid Classroom ID or Host Password"
                    );
                }
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        socket.emit("Error", "Invalid Classroom ID or Host Password");
    }
};

module.exports = { join_classroom, start_classroom };
