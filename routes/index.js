const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
require('dotenv').config()

// 但是這些會要接到資料庫嗎？

// check if user is login
const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.send('need to login first')
  }
  next()
}

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
  const { password, username } = req.body
  // const sql = `SELECT * FROM member WHERE userId=${username}`
  // query/execute the sql query, then get back a result 

  // const isValidPwd = await bcrypt.compare(password, rows[0].password)

  // if (isValidPwd) {
  //     req.session.userId = rows[0].userId

  // // } else {res.send('login failed')}
});


/* POST register page. */
router.post('/register-google', async (req, res, next) => {
  console.log(req.body);
  // const {password, username} = req.body
  // const hashedPwd = await bcrypt.hash(password, 12)
  //const sql = "INSERT INTO..."
  // res.send(hashedPwd)

  // save the user into session, so the user don't have to login after register
  // req.session.userId = rows[0].userId

  // res.send('success')
});

router.post('/logout', (req, res) => {
  //req.session.userId = null
  req.session.destroy()
  res.send('log you out')
})

// add require login middleware 
router.get('/secret', requireLogin, (req, res) => {
  if (!req.session.userId) {
    res.status(401).json('oops you need to login first')
  } else {
    res.send('welcome back!')
  }
})

module.exports = router;
