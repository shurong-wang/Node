/**
 * 图片裁切
 */
var express = require("express");
var app = express();
var fs = require("fs");
var gm = require("gm"); // 需要系统安装 GraphicsMagick 软件

app.set("view engine", "ejs");
app.use(express.static("./public"));

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/crop", function (req, res) {
    //这个页面接收几个GET请求参数
    //文件名、w、h、x、y
    var filename = req.query.filename;
    var w = req.query.w;
    var h = req.query.h;
    var x = req.query.x;
    var y = req.query.y;

    gm("./picture/user-avatar.jpg")
        .crop(w, h, x, y)
        .resize(100, 100, "!")
        .write("./picture/cut-avatar.jpg", function (err) {
            console.log(err);

            if (err) {
                res.send("-1");
                return;
            }
            res.send("1");
        });
});

app.listen(3000);