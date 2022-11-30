const express = require("express");
require("./models/init");
const { createServer } = require("http");
const { Server } = require("socket.io");
const {
    join_classroom,
    start_classroom,
} = require("./controllers/classroom.controllers");

const app = express();
app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("New Connection: ", socket.id);

    socket.on("disconnect", () => {
        console.log("Disconnected: ", socket.id);
    });

    socket.on("join_classroom", (data) => {
        join_classroom(io, socket, data.classroomId, data.joinPassword);
    });

    socket.on("start_classroom", (data) => {
        start_classroom(io, socket, data.classroomId, data.hostPassword);
    });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
