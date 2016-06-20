/**
 * Created by Snowden on 2016/6/4.
 */

exports.getAlbums = getAlbums;
exports.getPhotos = getPhotos;
exports.doUpload = doUpload;

var fs = require("fs");
var formidable = require('formidable');
var path = require("path");
var sd = require("silly-datetime");

function getAlbums(callback) {
    fs.readdir("./uploads", function (err, files) {
        if (err) {
            callback("没有找到 uploads 目录", null);
            return;
        }
        var albums = [];
        // 用迭代器实现同步读取目录
        (function iterator(i) {
            if (i == files.length) {
                console.log(albums);
                callback(null, albums);
                return;
            }
            fs.stat("./uploads/" + files[i], function (err, stats) {
                if (err) {
                    callback("找不到文件" + files[i], null);
                    return;
                }
                if (stats.isDirectory()) {
                    // 收集数据
                    albums.push(files[i]);
                }
                iterator(i + 1);
            });
        })(0);
    });
}

function getPhotos(album, callback) {
    fs.readdir("./uploads/" + album, function (err, files) {
        if (err) {
            callback("没有找到 uploads 目录", null);
            return;
        }
        var photos = [];
        // 用迭代器实现同步读取目录
        (function iterator(i) {
            if (i == files.length) {
                //遍历结束
                console.log(photos);
                callback(null, photos);
                return;
            }
            fs.stat("./uploads/" + album + "/" + files[i], function (err, stats) {
                if (err) {
                    callback("找不到文件" + files[i], null);
                    return;
                }
                if (stats.isFile()) {
                    photos.push(files[i]);
                }
                iterator(i + 1);
            });
        })(0);
    });
}

function doUpload(req, callback) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../.temp/");
    console.log(form.uploadDir);
    form.parse(req, function (err, fields, files) {
        console.dir(fields);

        console.log(files.photo.name);
        console.log(files.photo.type);
        console.log(files.photo.path);
        console.log(files.photo.size  + "\n");

        if (err) {
            callback("获取照片信息失败", null);
            return;
        }
        //判断文件大小
        var size = parseInt(files.photo.size) / 1024 / 1024 ;
        console.log(size + "M\n");

        if (size  > 1 ) {
            //删除图片
            fs.unlink(files.photo.path);
            callback("照片尺寸应该小于1M", null);
            return;
        }

        //照片重命名
        var basename = sd.format(new Date(), 'YYYYMMDDHHmmss') + parseInt(Math.random() * 89999 + 10000);
        var extname = path.extname(files.photo.name);
        var album = fields.album;
        var oldpath = files.photo.path;
        var newpath = path.normalize(__dirname + "/../uploads/" + album + "/" + basename + extname);
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                callback("照片重命名失败", null);
                return;
            }
            callback(null, {"photo": files.photo.name});
        });
    });
}