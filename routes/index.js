var express = require('express');
var router = express.Router();
require('dotenv').config()

// 但是這些會要接到資料庫嗎？

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(process.env.PASSWORD);
  res.render('index', { title: 'Express' });
});

/* GET about page. */
router.get('/about', function (req, res, next) {
  console.log(process.env.PASSWORD);
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  
});

/* POST login page. */
router.post('/login', function (req, res, next) {
  
});

/* GET register page. */
router.get('/register', function (req, res, next) {
  
});

/* POST register page. */
router.post('/register', function (req, res, next) {
  
});




module.exports = router;
