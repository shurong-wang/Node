var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require("express-session");
var morgan = require('morgan');

var app = express();

// 中间件（1） -- 静态服务
app.use(express.static('./public'));

// 中间件（2） -- JOSN解析
app.use(bodyParser.urlencoded({extended: false})); //接受form请求
app.use(bodyParser.json()); //接受json请求

// 中间件（3） -- cookie
app.use(cookieParser());

// 中间件（4） -- session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// 中间件（5） -- 打印请求日志
app.use(morgan());


// 路由（1）-- app.get()/app.post()
/*
  http://example.com/checklogin?username=yida&password=123456
 */
app.post('/login', function(req, res, next){
	var user = [
        {'userid': '1',
		'username': 'yida',
		'password': '123456'}
	];
    if (req.session.login == "1") {
        res.send("欢迎 " + req.session.username);
    } else {
		var username = req.body.username;
		var password = req.body.password;

        if (username == user[0].username && password == user[0].password) {
            req.session.login = "1";
            req.session.username = user[0].username;
            res.redirect("/");
            //res.send("登录成功！欢迎 " + user[0].username);
        } else {
			res.redirect("/register");
        }
    }
	next();
});

// 路由（2）-- express.Router();
/*
  http://example.com/book/add
  http://example.com/book/list
 */
var Router = express.Router();
app.use('/book', Router);
Router.get('/add', function(req, res){
  res.end('Router /add\n');
});
Router.get('/list', function(req, res){
  res.end('Router /list\n');
});


// 路由（3）-- app.route().get().post()
/*
  http://example.com/article
 */
app.route('/article')
    .get(function(req, res){
        res.end('route /article get\m');
    })
    .post(function(req, res){
        res.end('route /article post\n');
    });


// 路由参数
/*
  http://example.com/news/24
 */
app.get('/news/:classify', function (req, res) {
    var fav = req.params.classify;
    var preferences = req.cookies.preferences || [];
    fav && preferences.push(fav);
    res.cookie("preferences", preferences, {maxAge: 3600 * 1000, httpOnly: true}); //maxAge在express中以毫秒为单位

    //res.end('You love ' + fav);
});


// 模板设置
app.set('view engine', 'ejs');
app.set('views', 'views');
/*
app.engine('jade', require('jade').__express);
app.set("view engine", "jade");
*/
app.get('/', function (req, res) {
	var fav = req.cookies.preferences;
    res.render('home', {
        'title' : '首页',
        'channel' : '新闻频道',
        'news' : ['体育', '社会', '娱乐', '军事'],
		'userfav' : fav,
    });
	res.end('You maybe love ' + fav);
});

app.route('/register').get(function (req, res) {
    res.render('register', {
        'title' : '用户注册',
        'name' : '',
        'age' : ''
    });
}).post(function(req, res){
    var fav = req.cookies.preferences;
    var name = '王哲-' + req.body.name;
    var age = req.body.age - 10;
    res.render('register', {
        'title' : '用户注册',
        'name' : name,
        'age' : age,
        'userfav' : fav
    });
});

app.listen(3000, function(){
  console.log('express running on http://localhost:3000');
});