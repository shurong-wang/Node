var express = require('express');
var bodyParser = require('body-parser');
var route = require('../app/routes/news.server.routes');

module.exports = function () {
  var app = express();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static("./public"));

  // 关键 -- 载入路由
  route(app);

  // 404 统一处理未知的请求
  app.use(function (req, res, next) {
    res.status(404);
    try {
      return res.json('Not Found');
    } catch (e) {
      console.error('404 set header after sent');
    }
  });

  // 500 统一处理出错的情况
  app.use(function (err, req, res, next) {
    if (!err) {
      return next()
    }
    res.status(500);
    try {
      return res.json(err.message || 'server error');
    } catch (e) {
      console.error('500 set header after sent');
    }
  });

  return app;
};