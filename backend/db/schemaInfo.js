const mongoose = require("mongoose");

const SchemaInfoSchema = new mongoose.Schema({
  version: { type: String },
  load_date_time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SchemaInfo", SchemaInfoSchema);
