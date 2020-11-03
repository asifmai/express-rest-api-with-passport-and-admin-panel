require('dotenv').config();
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const connectDB = require('./config/db');

// Initialize App
const app = express();

// Connect Database
connectDB();

// Passport Config
require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Log Routes
app.use(logger('dev'));

// Accept Json in Request
app.use(express.json({ extended: true, limit: '200mb' }));
app.use(express.urlencoded({ extended: false, limit: '200mb'}));

// Express Session
app.use(session({
  secret: 'harisiqbal',
  resave: true,
  saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Enable Cors
app.use(cors());

// Other MiddleWares
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');            // Error from Passport
  res.locals.user = req.user;
  next();
});

// Routes Configuration
app.get('/', (req, res) => res.status(200).send('API Running'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));

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
  res.send('Page Not Found');
});

module.exports = app;
