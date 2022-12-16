const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

// Define the Classroom model
const Classroom = sequelize.define("Classroom", {
    // id is automatically created by sequelize
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    hostName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // The host password is used to join the classroom as the host
    hostPassword: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // The join password is used to join the classroom as a student
    joinPassword: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Classroom;
