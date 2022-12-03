const { Classroom } = require("../models/init");

const join_classroom = (
    io,
    socket,
    { classroomId, joinPassword, username }
) => {
    // If the user is the host
    console.log("Hey");
    Classroom.findOne({
        where: {
            id: classroomId,
            hostPassword: joinPassword,
            hostName: username,
        },
    })
        .then((classroom) => {
            if (classroom) {
                socket.join(classroom.id);
                socket.emit("join_classroom", {
                    classroomId: classroom.id,
                    host: true,
                    username: username,
                    joinPassword: joinPassword,
                });
            } else {
                console.log("Student joined");
                // If the user is a student
                Classroom.findOne({
                    where: {
                        id: classroomId,
                        joinPassword: joinPassword,
                    },
                }).then((classroom) => {
                    if (classroom) {
                        // Check number of students in the socket room, max 8
                        const room = io.sockets.adapter.rooms.get(classroom.id);
                        if (!room || room.length >= 8) {
                            socket.emit(
                                "Error",
                                "Classroom is full or hasn't started"
                            );
                        } else {
                            socket.join(classroom.id);
                            socket.emit("join_classroom", {
                                classroomId: classroom.id,
                                host: false,
                                username: username,
                                joinPassword: joinPassword,
                            });
                        }
                    } else {
                        socket.emit("Error", "Invalid Password");
                    }
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

const start_classroom = (_io, socket, classroomId, hostPassword) => {
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

const create_classroom = (_io, socket, { hostName, hostPassword }) => {
    // Generate a random join password
    const joinPassword = Math.random().toString(36).substring(2, 15);

    // Create the classroom
    Classroom.create({
        hostName: hostName,
        hostPassword: hostPassword,
        joinPassword: joinPassword,
    })
        .then((classroom) => {
            socket.emit("create_classroom", {
                success: true,
                message: "Created Classroom",
                classroomId: classroom.id,
                joinPassword: classroom.joinPassword,
            });
        })
        .catch((err) => {
            console.log(err);
            socket.emit("Error", "Error creating classroom");
        });
};

const draw_whiteboard = (
    io,
    socket,
    {
        classroomId,
        mouseX,
        mouseY,
        pmouseX,
        pmouseY,
        color,
        size,
        hostName,
        hostPassword,
    }
) => {
    // Check if the user is the host
    Classroom.findOne({
        where: {
            id: classroomId,
            hostPassword: hostPassword,
            hostName: hostName,
        },
    }).then((classroom) => {
        if (classroom) {
            // Emit the draw event to all the students
            io.to(classroomId).emit("draw_whiteboard", {
                mouseX,
                mouseY,
                pmouseX,
                pmouseY,
                color,
                size,
            });
        } else {
            socket.emit("Error", "Invalid Host Password");
        }
    });
};

module.exports = {
    join_classroom,
    start_classroom,
    create_classroom,
    draw_whiteboard,
};
