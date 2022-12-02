const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Classroom = sequelize.define("Classroom", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    hostName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    hostPassword: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    joinPassword: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Classroom;
