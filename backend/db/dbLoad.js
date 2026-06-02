const mongoose = require("mongoose");
require("dotenv").config();

const { User, Photo } = require("./models");
const SchemaInfo = require("./schemaInfo");

async function dbLoad() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected MongoDB Atlas");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  const userCount = await User.countDocuments();
  const photoCount = await Photo.countDocuments();
  const schemaInfoCount = await SchemaInfo.countDocuments();

  console.log(`Current MongoDB data - Users: ${userCount}, Photos: ${photoCount}, SchemaInfo: ${schemaInfoCount}`);

  await mongoose.disconnect();
}

dbLoad();
