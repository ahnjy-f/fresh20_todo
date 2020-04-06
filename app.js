var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var i18n = require("i18n");

var app = express();
let ses_opt = {
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 60 * 60 * 1000}
};
app.use(session(ses_opt));

// i18nの利用設定
i18n.configure({
  // 利用するlocalesを設定。これが辞書ファイルとひも付きます
  locales: ['ja', 'ko', 'en'],
  defaultLocale: 'ja',
  // 辞書ファイルのありかを指定
  directory: __dirname + "/locales",
  // オブジェクトを利用したい場合はtrue
  objectNotation: true
});

app.use(i18n.init);
// manualでi18nセッション管理できるように設定しておきます
app.use(function (req, res, next) {
  if (req.session.locale) {
    i18n.setLocale(req, req.session.locale);
  }
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
