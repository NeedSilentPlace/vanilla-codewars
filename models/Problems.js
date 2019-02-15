const mongoose = require('mongoose');

var ProblemSchema = mongoose.Schema({
  title: { type: String, required: true },
  solution_count: { type: Number, required: true },
  difficulty_level: { type: Number, required: true},
  description: {type: String, required: true },
  tests: { type: Array, required: true }
});

module.exports = mongoose.model('Problem', ProblemSchema);
