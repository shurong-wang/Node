/**
 * 简单静态服务器
 */
var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");

var server = http.createServer(function (req, res) {
    //不处理收藏图标
    if (req.url == "/favicon.ico") {
        return;
    }
    
    //得到地址（不含query）
    var pathname = url.parse(req.url).pathname;

    //简单判断：如果请求是目录，则自动转向目录中的 index.html 文件
    if (pathname.indexOf(".") == -1) {
        pathname += "/index.html";
    }

    //拼接静态文件目录
    var fileURL = path.normalize("./static/" + pathname);
    console.log(fileURL);

    //得到拓展名
    var extname = path.extname(pathname);

    //把文件读出来
    fs.readFile(fileURL, function (err, data) {
        if (err) {
            res.writeHead(404, {"Content-Type": "text/html;charset=UTF-8"})
            res.end("404,页面没有找到");
        }
        //获取MIME类型，连同数据响应给用户
        getMime(extname, function (mime) {
            res.writeHead(200, {"Content-Type": mime})
            res.end(data);
        });
    });
});
server.listen(3000, "127.0.0.1");

function getMime(extname, callback) {
    //读取mime.json文件内容，转换得到JSON对象
    fs.readFile("./mime.json", function (err, data) {
        if (err) {
            throw Error("找不到mime.json文件！");
            return;
        }
        //转成JSON
        var mimeJSON = JSON.parse(data);
        var mime = mimeJSON[extname] || "text/plain";
        //执行回调函数，mime类型字符串，就是它的参数
        callback(mime);
    });
}