var express = require('express');
var path = require('path');

var app = express();

// 模板引擎设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 引入 mongoose 配置文件，执行连库建模等
var mongoose = require('./config/mongoose.js');
mongoose();

// 路由设置
var index = require('./routes/index');
var user = require('./routes/user');
app.use('/', index);
app.use('/user', user);

module.exports = app;
