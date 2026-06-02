const mongoose = require("mongoose");

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

module.exports = mongoose.model("Photos", PhotoSchema);
