const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected MongoDB Atlas");
  } catch (err) {
    console.error(err);
  }
}

module.exports = dbConnect;
