const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
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


/* POST login page. */
router.post('/login', async(req, res, next)=> {
  res.send(req.body)
});


/* POST register page. */
router.post('/register', async (req, res, next)=> {
  const {password, username} = req.body
  const hashedPwd = await bcrypt.hash(password, 12)
  //const sql = "INSERT INTO..."
  res.send(hashedPwd)
  // res.send('success')
});




module.exports = router;
