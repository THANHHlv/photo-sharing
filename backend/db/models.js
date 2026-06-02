const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  login_name: { type: String, unique: true },
  password: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
});

const CommentSchema = new mongoose.Schema({
  comment: { type: String },
  date_time: { type: Date, default: Date.now },
  user_id: { type: mongoose.Schema.Types.ObjectId },
});

const PhotoSchema = new mongoose.Schema({
  file_name: { type: String },
  date_time: { type: Date, default: Date.now },
  user_id: { type: mongoose.Schema.Types.ObjectId },
  comments: [CommentSchema],
});

module.exports = {
  User: mongoose.model("Users", UserSchema),
  Photo: mongoose.model("Photos", PhotoSchema),
};
