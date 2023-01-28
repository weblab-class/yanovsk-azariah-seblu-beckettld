const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
  problemText: String,
  problemScript: String,
  testCases: Array,
  difficulty: String,
  version: String,
});

// compile model from schema
module.exports = mongoose.model("problem", ProblemSchema);
