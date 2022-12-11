const { Classroom } = require("../models/init");

const join_classroom = (
    io,
    socket,
    { classroomId, joinPassword, username }
) => {
    // If the user is the host
    Classroom.findOne({
        where: {
            id: classroomId,
            hostPassword: joinPassword,
            hostName: username,
        },
    })
        .then((classroom) => {
            if (classroom) {
                socket.data.isHost = true;
                socket.join(classroom.id);
                socket.emit("join_classroom", {
                    classroomId: classroom.id,
                    host: true,
                    username: username,
                    joinPassword: joinPassword,
                });

                // Update the students
                update_students(io, classroom.id);
            } else {
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
                        if (room && room.length >= 8) {
                            socket.emit(
                                "Error",
                                "Classroom is or hasn't started"
                            );
                        } else {
                            socket.data.isHost = false;
                            socket.join(classroom.id);
                            socket.emit("join_classroom", {
                                classroomId: classroom.id,
                                host: false,
                                username: username,
                                joinPassword: joinPassword,
                            });

                            // Update the students
                            update_students(io, classroom.id);
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

const update_students = (io, classroomId) => {
    // Get all the students in the classroom
    try {
        let students = io.sockets.adapter.rooms.get(classroomId);
        students = Array.from(students);

        const studentsSocket = students.map((student) => {
            return io.sockets.sockets.get(student);
        });
        let studentSocketData = studentsSocket.map((student) => {
            return { data: student.data, id: student.id };
        });

        // // Exclude the host from the students
        // studentSocketData = studentSocketData.filter(
        //     (student) => student.data.isHost === false
        // );

        io.to(classroomId).emit("students_update", studentSocketData);
    } catch (err) {
        console.log(err);
    }
};

const update_students_all = (io) => {
    // Get all rooms
    const allRooms = io.sockets.adapter.rooms;
    // Loop over the map
    allRooms.forEach((value, key) => {
        // Check if the room is empty
        if (value.size !== 0) {
            // Update the students
            update_students(io, key);
        }
    });
};

const clear_whiteboard = (
    io,
    socket,
    { classroomId, hostName, hostPassword }
) => {
    // Check if the user is the host
    Classroom.findOne({
        where: {
            id: classroomId,
            hostPassword: hostPassword,
            hostName: hostName,
        },
    })
        .then((classroom) => {
            if (classroom) {
                // Emit the clear event to all the students
                io.to(classroomId).emit("clear_whiteboard");
            } else {
                socket.emit("Error", "Invalid Host Password");
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

module.exports = {
    join_classroom,
    start_classroom,
    create_classroom,
    draw_whiteboard,
    update_students,
    update_students_all,
    clear_whiteboard,
};
