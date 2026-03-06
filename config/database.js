const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Could not connect to MongoDB", err);
      process.exit(1);
    });
};

module.exports = dbConnection;
