const Joi = require("joi");

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

module.exports = {
    createClassroomValidator,
    joinClassroomValidator,
    drawWhiteboardValidator,
    studentsUpdateValidator,
};
