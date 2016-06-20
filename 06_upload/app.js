/**
 * Created by Snowden on 2016/6/4.
 */

var express = require("express");
var app = express();
// 控制器（路由）
var router = require('./controller');
// 模板设置
app.set('view engine', 'ejs');
app.set('views', 'views');
// 静态资源
app.use(express.static("./public"));
app.use(express.static("./uploads"));
// 路由分发
// -- 相册列表
app.get('/', router.albums);
// -- 照片列表
app.get('/:album', router.photos);
// -- 上传表单/执行上传
app.route('/upload').get(router.upload).post(router.doUpload);
// 错误页面
app.use(function (req, res) {
    res.render('errorPage', {
        'title': '出错啦！'
    });
});
// 监听端口
app.listen(3000);