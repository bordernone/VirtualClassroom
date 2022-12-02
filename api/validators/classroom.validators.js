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

module.exports = { createClassroomValidator, joinClassroomValidator };
