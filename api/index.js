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
    clear_whiteboard,
} = require("./controllers/classroom.controllers");
const {
    createClassroomValidator,
    joinClassroomValidator,
    drawWhiteboardValidator,
    studentsUpdateValidator,
    updateStudentStatus,
    clearWhiteboardValidator,
} = require("./validators/classroom.validators");
const { instrument } = require("@socket.io/admin-ui");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();

// Serve static files from the React app if in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "public")));
    app.get("/*", function (req, res) {
        return res.sendFile(path.join(__dirname, "public", "index.html"));
    });
}

app.use(express.json());

app.use(cors());

const httpServer = createServer(app, {
    cors: {
        origin: ["*"],
        credentials: true,
    },
});

const io = new Server(httpServer);

// Admin UI for Socket.io
instrument(io, {
    auth: {
        type: "basic",
        username: process.env.ADMIN_USERNAME,
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
    },
    mode: "development",
});


// Socket.io events
io.on("connection", (socket) => {
    console.log("New Connection: ", socket.id);

    socket.on("disconnect", () => {
        console.log("Disconnected: ", socket.id);
        update_students_all(io);
    });

    socket.on("join_classroom", (data) => {
        // validate the data
        const { error } = joinClassroomValidator(data);
        if (error) {
            // send the error message to the client
            socket.emit("Error", error.details[0].message);
        } else {
            // set the socket data
            socket.data.user = data.username;
            socket.data.armRaised = false;
            socket.data.isPresent = false;
            join_classroom(io, socket, data);
        }
    });

    socket.on("create_classroom", (data) => {
        // validate the data
        const { error } = createClassroomValidator(data);
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

    socket.on("update_status", (data) => {
        const { error } = updateStudentStatus(data);
        if (error) {
            socket.emit("Error", error.details[0].message);
        } else {
            // set the socket data
            socket.data.armRaised = data.armRaised;
            socket.data.isPresent = data.isPresent;
            update_students_all(io);
        }
    });

    socket.on("clear_whiteboard", (data) => {
        const { error } = clearWhiteboardValidator(data);
        if (error) {
            socket.emit("Error", error.details[0].message);
        } else {
            clear_whiteboard(io, socket, data);
        }
    });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
