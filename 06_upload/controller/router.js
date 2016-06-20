/**
 * Created by Snowden on 2016/6/4.
 */
exports.albums = albums;
exports.photos = photos;
exports.upload = upload;
exports.doUpload = doUpload;

var albumModel = require("../modules/album.js");

function albums(req, res, next) {
    /*
     错误思维：
        试图接收 album.getAlbums() 返回数据，并渲染到模板：
        res.render("albums",{
            "albums" : album.getAlbums() // 无法获取期待的数据
        });
        以上是同步编程的模式，不适用 node.js 异步非阻塞 I/O 的特性
    */

    /*
     异步思维：
        将“回调函数”作为参数传递到 module，用“回调函数”的参数接收 module 中数据
    */
    albumModel.getAlbums(function (err, data) {
        if(err){
            next(); //向后传递
            return;
        }
        res.render('albums', {
            "title": "相册",
            "albums" : data
        });
    });
}

function photos(req, res, next) {
    var album = req.params.album; //相册名称
    albumModel.getPhotos(album, function (err, data) {
        if(err){
            next(); //向后传递
            return;
        }
        res.render('photos', {
            'title': '照片',
            "album" : album,
            "photos" : data
        });
    });
}

function upload(req, res, next) {
    albumModel.getAlbums(function (err, data) {
        if(err){
            next(); //向后传递
            return;
        }
        res.render('upload', {
            'title': '上传照片',
            "photo" : "",
            "albums" : data
        });
    });
}

function doUpload(req, res, next) {
    albumModel.doUpload(req, function (err, data) {
        if(err){
            res.send(err);
            return;
        }
        res.send('照片' + data.photo + '上传成功！');

        /*
        res.render('upload', {
            'title': '保存照片',
            "photo" : data.photo,
            "albums" : {}
        });
        */

    });
}