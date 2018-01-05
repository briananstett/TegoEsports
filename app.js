var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();

/******Mongo Connection*****/
mongoose.connect('mongodb://localhost/TeGoEsports');
var database = mongoose.connection;
database.on('error', console.error.bind(console, "connection error"));

/******APP Middleware******/
//Session
app.use(session({
  secret: '7iQRid3rde',
  resave: true,
  saveUninitialized: true,
  store : new MongoStore({
    mongooseConnection: database
  })
}));

app.use(compression());

app.use('/static', express.static(__dirname + '/public'));
//Let all views have access to session id
app.use(function(req, res, next){
  res.locals.currentUser = req.session.userId;
  next();
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public

// view engine setup
app.set('view engine', 'pug');

// include routes
app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});


// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errorStatus: err.status
  });
});



// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});