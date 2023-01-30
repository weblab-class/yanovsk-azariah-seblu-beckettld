const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
  problemText: String,
  problemScript: String,
  testCases: Array,
  mapId: Number,
  towerId: Number,
  dialogue: Array,
  name: String,
  x: Number,
  y: Number,
});

// compile model from schema
module.exports = mongoose.model("problem", ProblemSchema);
