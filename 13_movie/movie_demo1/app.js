var express = require('express');
var jade = require('jade');
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('underscore');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/movie');

var app = express();
var port = process.env.PORT || 3000;
app.locals.moment = require('moment');

// 设置模板引擎
app.set('views', './views/pages');
app.set('view engine', 'jade');
// 静态资源请求路径
app.use(express.static(path.join(__dirname, 'public/')));
// 表单数据格式化
app.use(bodyParser());

var Movie = require('./models/movie');
var emptyMovie = {
    title: "",
    doctor: "",
    country: "",
    language: "",
    year: "",
    poster: "",
    summary: ""
};

// -- 路由设置 -- //
// 用户界面
app.get('/', function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', { title: '电影-首页', movies: movies });
    });
});
app.get('/list', function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', { title: '电影-列表', movies: movies });
    });
});
app.get('/detail/:id', function(req, res) {
    var id = req.params.id;

    Movie.findById(id, function(err, movie) {
        res.render('detail', { title: '电影-详情', movie: movie });
    })
});

// 管理员界面
app.get('/admin/new', function(req, res) {
    res.render('new', { title: '电影-后台录入页', movie: emptyMovie });
});

// 逻辑控制:插入
app.post('/admin/new', function(req, res) {
    var movieObj = req.body.movie;
    var id = movieObj._id;
    var _movie;
    if (id != 'undefined') {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/detail/' + movie._id);
            });
        });
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/detail/' + movie._id);
        });
    }
});
// 逻辑控制:更新
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function(err, movie) {
            res.render('new', {
                title: '后台更新页',
                movie: movie
            })
        })
    }
});
// 逻辑控制:删除
app.delete('/admin/delete', function(req, res) {
    var id = req.query.id;

    if (id) {
        Movie.remove({ _id: id }, function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({ success: true });
            }
        });
    }
});

// 监听端口
app.listen(port);
console.log('server started on port: ' + port);
