const fs = require('fs');

const express = require('express');
const router = express.Router();
const vm = require('vm')
const Problem = require('../models/Problems');
const auth = require('../controllers/AuthController');

router.get('/register', auth.register);
router.post('/register', auth.doRegister);
router.get('/login', auth.login);
router.post('/login', auth.doLogin);
router.get('/logout',auth.logout);
console.log(1);
fs.readFile('./routes/hell.txt', 'utf8', function(err, data) {
  if(err) {
    throw err;
  }
  console.log(data);
});
console.log(2);


router.get('/', (req, res) => {
  if(!req.user) {
    if(req.query.difficulty_level) {
      const difficultyLevel = parseInt(req.query.difficulty_level);
      
      Problem.find({ difficulty_level: difficultyLevel })
        .then(problemDatas => {
          res.json(problemDatas);
        });
    } else {
      Problem.find()
        .then(problemDatas => {
          const difficultyLevels = [...new Set(problemDatas.map(data => data.difficulty_level))];
  
          res.render('index', { problems: problemDatas, difficultyLevels, user: '' });
        });
    }
  } else {
    if(req.query.difficulty_level) {
      const difficultyLevel = parseInt(req.query.difficulty_level);
      
      Problem.find({ difficulty_level: difficultyLevel })
        .then(problemDatas => {
          res.json(problemDatas);
        });
    } else {
      Problem.find()
        .then(problemDatas => {
          const difficultyLevels = [...new Set(problemDatas.map(data => data.difficulty_level))];
  
          res.render('index', { problems: problemDatas, difficultyLevels, user: req.user.username });
        });
    }
  }
});

router.get('/problems/:problem_id', (req, res, next) => {
  if(!req.user) {
    return res.redirect('/login');
  }
  Problem.findById(req.params.problem_id, function(err, problem) {
    if(err) {
      err.message = '문제를 찾을 수 없습니다';
      err.status = 404;
      return next(err);
    }
    
    res.render('problem', { problem });
  });
});

router.post('/problems/:problem_id', (req, res, next) => {
  const problemId = req.params.problem_id;
  const testResult = [];
  const userSolution = req.body.answer;

  Problem.findById(problemId, function(err, problem) {
    if(err) {
      return next(err);
    }
    const sandbox = {};

    try {
      for(let i = 0; i < problem.tests.length; i++) {
        const script = new vm.Script(`
          function solution(arg) {
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
      res.json(testResult);
    } catch(error) {
      res.json(error.message);
    }
  });
});

module.exports = router;
