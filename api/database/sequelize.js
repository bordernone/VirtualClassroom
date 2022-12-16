const { Sequelize } = require("sequelize");

// Setup the database and dialect
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
});

async function connect() {
    try {
        // Test the connection
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}

// Connect to the database
connect();

module.exports = sequelize;
