var express = require('express');
var router = express.Router();
require('dotenv').config()

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(process.env.PASSWORD);
  res.render('index', { title: 'Express' });
});

module.exports = router;
