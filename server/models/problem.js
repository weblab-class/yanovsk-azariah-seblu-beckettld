const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
  problemText: String,
  testCases: Array,
  difficulty: String,
});

// compile model from schema
module.exports = mongoose.model("question", ProblemSchema);
