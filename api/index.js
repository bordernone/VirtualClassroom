require("dotenv").config();
const express = require("express");
require("./models/init");
const { createServer } = require("http");
const { Server } = require("socket.io");
const {
    join_classroom,
    create_classroom,
    draw_whiteboard,
    update_students,
    update_students_all,
} = require("./controllers/classroom.controllers");
const {
    createClassroomValidator,
    joinClassroomValidator,
    drawWhiteboardValidator,
    studentsUpdateValidator,
    updateArmStatusValidator,
} = require("./validators/classroom.validators");
const { instrument } = require("@socket.io/admin-ui");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
app.use(express.json());

app.use(cors());

const httpServer = createServer(app, {
    cors: {
        origin: ["*"],
        credentials: true,
    },
});

const io = new Server(httpServer);

instrument(io, {
    auth: {
        type: "basic",
        username: process.env.ADMIN_USERNAME,
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
    },
    mode: "development",
});

io.on("connection", (socket) => {
    console.log("New Connection: ", socket.id);

    socket.on("disconnect", () => {
        console.log("Disconnected: ", socket.id);
        update_students_all(io);
    });

    socket.on("join_classroom", (data) => {
        const { error } = joinClassroomValidator(data);
        if (error) {
            socket.emit("Error", error.details[0].message);
        } else {
            socket.data.user = data.username;
            join_classroom(io, socket, data);
        }
    });

    socket.on("create_classroom", (data) => {
        const { error } = createClassroomValidator(data);
        console.log(data);
        if (error) {
            socket.emit("Error", error.details[0].message);
        } else {
            create_classroom(io, socket, data);
        }
    });

    socket.on("draw_whiteboard", (data) => {
        const { error } = drawWhiteboardValidator(data);
        if (error) {
            socket.emit("Error", error.details[0].message);
        } else {
            draw_whiteboard(io, socket, data);
        }
    });

    socket.on("students_update", (data) => {
        const { error } = studentsUpdateValidator(data);
        if (error) {
            socket.emit("Error", error.details[0].message);
        } else {
            update_students(io, data.classroomId);
        }
    });

    socket.on("update_arm_status", (data) => {
        const { error } = updateArmStatusValidator(data);
        if (error) {
            socket.emit("Error", error.details[0].message);
        } else {
            socket.data.armRaised = data.armRaised;
            update_students_all(io);
        }
    });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, "public")));
