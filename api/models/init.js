const Classroom = require("./Classroom");
const sequelize = require("../database/sequelize");

// Sync the database
sequelize.sync().then(() => {
    console.log("Database & tables created!");
});

module.exports.Classroom = Classroom;
module.exports.sequelize = sequelize;
