### 访问地址
* [首页](http://127.0.0.1:3000)
* [搜索](http://127.0.0.1:3000/search)
* [登录](http://127.0.0.1:3000/signin)
* [注册](http://127.0.0.1:3000/signup)
* [分类列表](http://127.0.0.1:3000/admin/category/list)
* [添加分类](http://127.0.0.1:3000/admin/category/add)
* [电影列表](http://127.0.0.1:3000/admin/movie/list)
* [添加电影](http://127.0.0.1:3000/admin/movie/add)



### Bower 安装
##### 注意：在 Windows 中不能用 cmd 控制台执行，可以使用 Git Bash 执行
### 表单接收 POST 请求
```
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
```
* 在 post 时，在 name 中传入 name = 'user[name]' 方便 bodyParser 直接解析 user 对象
### 中间件
* 使用 middlewarem 时一定要注意有 next()
* 把所有页面都要处理的事情放在 app.use() 中， 注意中间件中的每一种可能最终都要 **return next()**
### 注册本地变量
* app.locals.user = _user， _user 是内部需要暴露出去的变量
### 数据响应
* 返回数据的是 JSON 用 res.json()，返回 template(jade) 用 res.render()
### 闭包应用
* 通过闭包实现内部的资源绑定，向上传递数据，通过 callback 的 args 来暴露内部的返回结果
### session 持久化
* session 持久化到 mongodb 要用到 cookie-parser，connect-mongo ，express-session
注意：cookie-parser 要放在 session 前面
```
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: config.secret,
  store: new mongoStore({
    url: config.dbUrl,
    collection: 'sessions'
  })
}));
```
### Dev 配置
```
var env = process.env.NODE_ENV || 'development';
if ('development' === env) {
  app.set('showStackError', true);
  app.locals.pretty = true;
  mongoose.set('debug', true);
}
```
### User 权限控制
* 用户的权限控制可以用 number 来做
  =0 normal | =1 verified | =2 senior | >10 admin | >50 super root
* 如果没有登录`if(!user){return res.redirect('/signin')}`
* 不要把用户权限的管理混在具体页面的功能实现上，用 express 的中间件去做
```
app.get('/user', Middleware1, Middleware2, pageFunction);
```
* 中间件一般写在 Controller 中

### MongoDB
* `show dbs | show tables | use movie`
* `db.collectionName.update({条件},{$set:{新值}})`
* `db.collectionName.findOne({"key":"value"})`
* Mongoose 的 **populate** 实现不同 Model 的引用
* populate 参数： path, select, match, model, options
* 引用类型： objectId、Number、String、Buffer
* ObjectId = Schema.Types.ObjectId
```
Comment
      .find({movie: id})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .find({})
      .populate({path:'movies',options:{limit:5}})
```
* category 在 movie 中的字段为什么用 Schema.Types.ObjectId 类型？
> 为了建立双向的 movie 和 category 的映射，不需要通过 String 做二次查询

### Bootstrap
* `.panel.panel-default | .panel-heading > .panel-title | .panel-body`
* `.panel.panel-primary`
* Media list
```
<ul class="media-list">
  <li class="media">
    <div class="media-left">
      <a href="#">
        <img class="media-object" src="..." alt="...">
      </a>
    </div>
    <div class="media-body">
      <h4 class="media-heading">Media heading</h4>
      ...
    </div>
  </li>
</ul>
```

### Mongo CLI
`db.movies.find()`
`db.movies.remove()`
`db.movies.update({FIND},{UPDATE},{OPTIONS})`
### Array API

* `array.splice(index, length, [insert Elements])`
  > splice() 主要用作修改数组元素值和元素个数
  > index 是操作开始的位置
  > length = 0 表示添加元素，length > 0 表示删除替换元素数
  > insert Elements 表示向数组新添加的元素
  > splice() 返回原数组被删除的元素
  > splice() 会直接对原数组进行修改
* `array.slice(start, end)`
  > slice() 主要用作获取数组指定元素
  > start 指定选取开始位置（含）
  > end 指定选取结束位置（不含）
  > slice() 返回选取的子数组
  > slice() 不会原对数组进行修改
### Douban Movie API
* https://api.douban.com/v2/movie/subject/1393859















