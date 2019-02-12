var express = require('express');
var router = express.Router();
var fs = require('fs');


var util = require('util');
var vm = require('vm');


/* GET home page. */
router.get('/', (req, res) => {
  fs.readFile('./data/problems.json', 'utf8', function(err, data) {
    let problems = JSON.parse(data);
    const difficultyLevels = [...new Set(problems.map(problem => problem.difficulty_level))];
    
    if(req.query.difficulty_level) {
      const difficultyLevel = parseInt(req.query.difficulty_level);

      problems = problems.filter(problem => problem.difficulty_level === difficultyLevel);
    }

    res.render('index', { title: '바닐라코딩', problems, difficultyLevels });
  });
});

router.get('/problems/:problem_id', (req, res, next) => {
  if(idValidator(req.params.problem_id)) {
    const problemId = parseInt(req.params.problem_id);

    fs.readFile('./data/problems.json', 'utf8', (err, data) => {
      const problem = JSON.parse(data).filter(item => item.id === problemId)[0];

      res.render('problem', { problem, testResult: '', errorMessage: '', userSolution: '' });
    });
  } else {
    next();
  }
});

router.post('/problems/:problem_id', (req, res, next) => {
  if(idValidator(req.params.problem_id)) {
    const problemId = parseInt(req.params.problem_id);
    const testResult = [];
    const userSolution = req.body.answer;

    fs.readFile('./data/problems.json', 'utf8', (err, data) => {
      const problem = JSON.parse(data).filter(item => item.id === problemId)[0];
      const sandbox = {};

      try {
        for(let i = 0; i < problem.tests.length; i++) {
          const script = new vm.Script(`function solution(arg) {
            return (${userSolution})(arg)
            }; 
            result = ${problem.tests[i].code};`);
          const context = vm.createContext(sandbox);

          script.runInContext(context);

          if(sandbox.result !== problem.tests[i].solution) {
            testResult.push([`Expected: ${problem.tests[i].solution}, instead got: ${sandbox.result}`, 'fail']);
          } else {
            testResult.push([`Pass`, 'success']);
          }
        }

        res.render('problem', { problem, testResult, errorMessage: '', userSolution });
      } catch(err) {
        const errorMessage = err.message;

        res.render('problem', { problem, testResult: false, errorMessage, userSolution });
      }
    });
  } else {
    next();
  }
});

function idValidator(id) {
  for(let i = 0; i < id.length; i++) {
    if(id[i].charCodeAt() < 48 || id[i].charCodeAt() > 57) {
      return false;
    }
  }

  return true;
}

module.exports = router;
