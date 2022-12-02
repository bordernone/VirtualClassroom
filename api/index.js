require("dotenv").config();
const express = require("express");
require("./models/init");
const { createServer } = require("http");
const { Server } = require("socket.io");
const {
    join_classroom,
    start_classroom,
    create_classroom,
} = require("./controllers/classroom.controllers");
const {
    createClassroomValidator,
    joinClassroomValidator,
} = require("./validators/classroom.validators");
const { instrument } = require("@socket.io/admin-ui");
const cors = require("cors");
const bcrypt = require("bcrypt");

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
    });

    socket.on("join_classroom", (data) => {
        const { error } = joinClassroomValidator(data);
        if (error) {
            socket.emit("Error", error.details[0].message);
        } else {
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
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
