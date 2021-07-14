const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session')


const indexRouter = require('./routes/index');
const bookingRouter = require('./routes/booking');
const userRouter = require('./routes/user');
// const cartRouter = require('./routes/cart');
// const messageRouter = require('./routes/message');
// const itemRouter = require('./routes/items');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// for authentication
app.use(session({ secret: 'notagoodsecret', resave: true, saveUninitialized: true }))

app.use('/', indexRouter);
app.use('/booking', bookingRouter);
app.use('/users', userRouter);
// app.use('/cart', cartRouter);
// app.use('/message', messageRouter);
// app.use('/items', itemRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
