Wireframe: https://www.figma.com/file/8js5abpipe0ZtndE5KvHwM/VirtualClassroom?node-id=0%3A1&t=nhcj07Aun4frrf1S-1

Live Version: https://virtualclassroom.onrender.com/

### Idea
VirtualClassroom is an app that simulates a classroom environment online. It aims to provide a more comfortable and engaging experience for users who may not be comfortable using video during online meetings. Instead of requiring a camera, the app utilizes the ML5 library to track the presence of users within the camera frame and displays their avatar accordingly. The app also includes a "hand-raise" feature, allowing users to virtually raise their hand and have the avatar reflect this action.

### Features
1. A virtual whiteboard that allows the host to draw and share with students in real time.
2. The ability to track participant presence without requiring camera usage.
3. A simple, shareable link for inviting participants to the session.

While VirtualClassroom offers a number of useful features, it also has a few limitations. 

### Limitations
1. The lack of audio feeding means that the "hand-raise" feature is not fully functional.
2. Some users may experience lag while drawing on the virtual whiteboard.
3. The app does not currently support screen sharing, which may be a necessary feature for some users in a virtual classroom setting.

### Challenges
1. Implementing logic to handle multiple classrooms using socket.io rooms was a difficult task.
2. Performance issues posed a significant challenge, requiring the use of a custom event dispatcher rather than polling for state changes.
3. Syncing the states of avatars proved difficult, as changes required redrawing and resulted in flickering.

### Process

#### Backend
I started the process by creating the backend. Here is how my backend is structured:

1. Socket.io was implemented and basic controllers were created to handle socket.io events.
2. Socket.io events were defined, including "connection," "disconnect," "join_classroom," "create_classroom," "draw_whiteboard," "students_update," "update_status," and "clear_whiteboard."

api/index.js
```javascript
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
            socket.data.armRaised = false;
            socket.data.isPresent = false;
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

    socket.on("update_status", (data) => {
        const { error } = updateStudentStatus(data);
        if (error) {
            socket.emit("Error", error.details[0].message);
        } else {
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

```

1. Validators were used to verify data received through each event, and appropriate actions were taken based on the validity of the data. These actions included emitting errors, joining or creating classrooms, drawing on the whiteboard, updating student status, and clearing the whiteboard. When an error was emitted, I made sure my frontend is listening and displaying the error to the user. Here are the validators:

api/validators/classroom.validators.js
```javascript
const createClassroomValidator = (payload) => {
    const schema = Joi.object({
        hostName: Joi.string().required(),
        hostPassword: Joi.string().required(),
    });
    return schema.validate(payload);
};

const joinClassroomValidator = (payload) => {
    const schema = Joi.object({
        classroomId: Joi.string().required(),
        joinPassword: Joi.string().required(),
        username: Joi.string().required(),
    });
    return schema.validate(payload);
};

const drawWhiteboardValidator = (payload) => {
    const schema = Joi.object({
        classroomId: Joi.string().required(),
        mouseX: Joi.number().required(),
        mouseY: Joi.number().required(),
        pmouseX: Joi.number().required(),
        pmouseY: Joi.number().required(),
        color: Joi.string().required(),
        size: Joi.number().required(),
        hostName: Joi.string().required(),
        hostPassword: Joi.string().required(),
    });
    return schema.validate(payload);
};

const studentsUpdateValidator = (payload) => {
    const schema = Joi.object({
        classroomId: Joi.string().required(),
    });
    return schema.validate(payload);
};

const updateStudentStatus = (payload) => {
    const schema = Joi.object({
        armRaised: Joi.boolean().required(),
        isPresent: Joi.boolean().required(),
    });
    return schema.validate(payload);
};

const clearWhiteboardValidator = (payload) => {
    const schema = Joi.object({
        classroomId: Joi.string().required(),
        hostName: Joi.string().required(),
        hostPassword: Joi.string().required(),
    });
    return schema.validate(payload);
};
```
4. For the database, I used sqlite3 with Sequelize ORM.

#### Frontend

1. There are two main "pages" for the react frontend: Homepage and Classroom.
2. The classroom page is further split into two main components: Students and Whiteboard each using an instance of p5 separately.

interface/src/pages/classroom.js
```javascript
<div className="row pt-5 pb-5">
    ...
        {data && <StudentsP5 socket={socket} state={data} />}
    </div>
    ...
        {data && <WhiteboardP5 socket={socket} state={data} />}

    ...
    </div>
</div>
```

3. The students component draws the avatar of the students in the classroom while the whiteboard component draws the whiteboard.

p5/Student/p5.js
```javascript
<LoadingOverlay
    active={this.state.loading}
    spinner
    text="Loading..."
>
    <Sketch
        setup={this.setup}
        draw={this.draw}
        preload={this.preload}
    />
    <video
        autoPlay
        id="video"
        ref={this.videoRef}
        height="300"
        width="300"
        className="d-none"
    ></video>
</LoadingOverlay>
```

p5/Whiteboard/p5.js
```javascript
import React from "react";
import Sketch from "react-p5";

export const WhiteboardCanvasHeight = 400;
export const WhiteboardCanvasWidth = 500;

class WhiteboardP5 extends React.Component {
    constructor(props) {
        ...
    }

    setup = (p5, canvasParentRef) => {
        ...
    };

    draw = (p5) => {
        ...
    };

    ...

    render() {
        return <Sketch setup={this.setup} draw={this.draw} />;
    }
}
```

#### Handling socket.io user attributes
I faced a challenge when trying to implement the feature that displays each student's username and avatar state in the virtual meeting. Initially, I considered storing this information in a database, but this would not be efficient because I did not have a model for the participants and it would require additional handling in the event that a connection is lost, which often happened. After some research, I discovered that I could store socket "data" within the socket object using a built-in feature of socket.io. This solution allowed me to store each participant's data within their socket object and ensured that they would be removed from the list of clients connected to the room if their connection was lost. This eliminated the need to worry about lost connections and made it easier to manage the data for each participant. Here is the code for storing the client data: 

api/index.js
```javascript
socket.on("join_classroom", (data) => {
    const { error } = joinClassroomValidator(data);
    if (error) {
        socket.emit("Error", error.details[0].message);
    } else {
        socket.data.user = data.username;
        socket.data.armRaised = false;
        socket.data.isPresent = false;
        join_classroom(io, socket, data);
    }
});

socket.on("update_status", (data) => {
    const { error } = updateStudentStatus(data);
    if (error) {
        socket.emit("Error", error.details[0].message);
    } else {
        socket.data.armRaised = data.armRaised;
        socket.data.isPresent = data.isPresent;
        update_students_all(io);
    }
});
```

Furthermore, every time a client updates their status, an event is emitted to all the participants in that room with the new status of the client.

api/controllers/classroom.controllers.js
```javascript
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

        io.to(classroomId).emit("students_update", studentSocketData);
    } catch (err) {
        console.log(err);
    }
};
```

#### Custom event handlers
Due to performance issues with the polling approach, I had to add custom event handlers to detect user's arm movement and presence in the classroom. 

p5/Student/p5.js
```js
detectArmStatusChange = (poses) => {
    ...
        const event = new CustomEvent("arm_status_change", {
            detail: {
                isRaised: true,
            },
        });
        window.dispatchEvent(event);
    ...
};
```

Here are the event listeners:

p5/Student/p5.js
```js
...
window.addEventListener("arm_status_change", this.onArmStatusChange);
window.addEventListener(
    "presence_status_change",
    this.onPresenceStatusChange
);
...
```

### Learning outcomes
1. Learned to use `joi` npm library to validate incoming requests.
2. Learned to integrate p5 with react.
3. Learned to create and trigger custom events in JavaScript.

### Next Steps
1. The app will benefit from replacing p5 with another library that redraws only when state is changed. This will improve the performance drastically and also eliminate issues caused due to reloading of the avatars in the event of state changes.
2. I plan to add audio feature similar to zoom.
3. I plan to add screen share feature too.
4. There should be a feature to chat with other users in the classroom through text.