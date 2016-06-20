var express = require('express');
var app = express();

// socket.io 固定书写格式
var http = require('http').Server(app);
var io = require('socket.io')(http);

//静态服务
app.use(express.static("./public"));

app.get('/', function (req, res) {
    res.sendFile( __dirname + "/views/" + "index.html" );
})

//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

io.on('connection', function (socket) {
    console.log('A user connected');

    //监听新用户加入
    socket.on('login', function (msg) {
        //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
        socket.name = msg.userid;

        //检查在线列表，如果不在里面就加入
        if (!onlineUsers.hasOwnProperty(msg.userid)) {
            onlineUsers[msg.userid] = msg.username;
            //在线人数+1
            onlineCount++;
        }

        //向所有客户端广播用户加入
        io.emit('login', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: msg});
        console.log(msg.username + '加入了聊天室');
    });

    //监听用户退出
    socket.on('disconnect', function () {
        //将退出的用户从在线列表中删除
        if (onlineUsers.hasOwnProperty(socket.name)) {
            //退出用户的信息
            var msg = {userid: socket.name, username: onlineUsers[socket.name]};

            //删除
            delete onlineUsers[socket.name];
            //在线人数-1
            onlineCount--;

            //向所有客户端广播用户退出
            io.emit('logout', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: msg});
            console.log(msg.username + '退出了聊天室');
        }
    });

    //监听用户发布聊天内容
    socket.on('message', function (msg) {
        //向所有客户端广播发布的消息
        io.emit('message', msg);
        console.log(msg.username + '说：' + msg.content);
    });

});

http.listen(3000);