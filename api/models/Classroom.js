const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize");

const Classroom = sequelize.define("Classroom", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
