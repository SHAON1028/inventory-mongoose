const mongoose = require("mongoose");
const colors = require("colors");
const dbConnect = async () => {
    try {
      await mongoose.connect(process.env.DATABASE_LOCAL);
      console.log("Connected to mongoDB.".italic.green);
    } catch (error) {
      throw error;
    }
  };

module.exports = dbConnect;