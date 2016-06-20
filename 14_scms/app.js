// 载入配置
var express = require('./config/express');
var mongodb = require('./config/mongoose');

// 执行代码
var db = mongodb();
var app = express();

// 导出项目
module.exports = app;