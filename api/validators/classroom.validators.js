const Joi = require("joi");

// Validate the payload for the create classroom route
const createClassroomValidator = (payload) => {
    const schema = Joi.object({
        hostName: Joi.string().required(),
        hostPassword: Joi.string().required(),
    });
    return schema.validate(payload);
};

// Validate the payload for the join classroom route
const joinClassroomValidator = (payload) => {
    const schema = Joi.object({
        classroomId: Joi.string().required(),
        joinPassword: Joi.string().required(),
        username: Joi.string().required(),
    });
    return schema.validate(payload);
};

// Validate the payload for the draw whiteboard route
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

// Validate the payload for the students update route
const studentsUpdateValidator = (payload) => {
    const schema = Joi.object({
        classroomId: Joi.string().required(),
    });
    return schema.validate(payload);
};

// Validate the payload for the update student status route
const updateStudentStatus = (payload) => {
    const schema = Joi.object({
        armRaised: Joi.boolean().required(),
        isPresent: Joi.boolean().required(),
    });
    return schema.validate(payload);
};

// Validate the payload for the clear whiteboard route
const clearWhiteboardValidator = (payload) => {
    const schema = Joi.object({
        classroomId: Joi.string().required(),
        hostName: Joi.string().required(),
        hostPassword: Joi.string().required(),
    });
    return schema.validate(payload);
};

module.exports = {
    createClassroomValidator,
    joinClassroomValidator,
    drawWhiteboardValidator,
    studentsUpdateValidator,
    updateStudentStatus,
    clearWhiteboardValidator,
};
