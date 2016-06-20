var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session); // session save to mongodb
var moment = require('moment'); // date processing libraries
var morgan = require('morgan'); // console output
var config = require('./config/config.js'); // mongodb config
var Route = require('./app/routes/route'); // Route module

// mongodb connection
mongoose.connect(config.dbUrl);

var app = express();

// static serve
var staticPath = path.join(__dirname, 'public');
//app.use(express.static(staticPath));
app.use(serveStatic(staticPath));

// template engine
app.set('view engine', 'jade');
app.set('views', './app/views/pages');
//app.engine('jade', require('jade').__express);

// grab POST request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// session and cookie Parser
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: config.secret,
  store: new mongoStore({
    url: config.dbUrl,
    collection: 'sessions'
  })
}));

// morgan logger for dev
app.use(morgan('dev'));

// config APP entry file
var env = process.env.NODE_ENV || 'development';
if ('development' === env) {
  app.set('showStackError', true);
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

// app.locals - global
app.locals.moment = moment;

// pass APP to the route !
Route(app);

// listen to port 
app.listen(config.port);

console.log('server is running on: ' + config.port);
