(function () {
    var
        d = document,
        w = window,
        dx = d.compatMode == 'CSS1Compat' ? d.documentElement : d.body;

    w.CHAT = {
        msgObj: d.getElementById("message"),
        screenheight: w.innerHeight ? w.innerHeight : dx.clientHeight,
        username: null,
        userid: null,
        socket: null,

        //用户提交聊天用户名
        usernameSubmit: function () {
            var username = d.getElementById("username").value;
            if (username != "") {
                d.getElementById("username").value = '';
                d.getElementById("loginbox").style.display = 'none';
                d.getElementById("chatbox").style.display = 'block';
                this.init(username);
            }
            return false;
        },

        //让浏览器滚动条保持在最低部
        scrollToBottom: function () {
            w.scrollTo(0, this.msgObj.clientHeight);
        },

        //退出，本例只是一个简单的刷新
        logout: function () {
            //this.socket.disconnect();
            location.reload();
        },

        //提交聊天消息内容
        submit: function () {
            var content = d.getElementById("content").value;
            if (content != '') {
                var msg = {
                    userid: this.userid,
                    username: this.username,
                    content: content
                };
                this.socket.emit('message', msg);
                d.getElementById("content").value = '';
            }
            return false;
        },

        genUid: function () {
            return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
        },

        //更新系统消息，本例中在用户加入、退出的时候调用
        updateSysMsg: function (msg, action) {
            //当前在线用户列表
            var onlineUsers = msg.onlineUsers;
            //当前在线人数
            var onlineCount = msg.onlineCount;
            //新加入用户的信息
            var user = msg.user;

            //更新在线人数
            var userhtml = '';
            var separator = '';
            for (key in onlineUsers) {
                if (onlineUsers.hasOwnProperty(key)) {
                    userhtml += separator + onlineUsers[key];
                    separator = '、';
                }
            }
            d.getElementById("onlinecount").innerHTML = '当前共有 ' + onlineCount + ' 人在线，在线列表：' + userhtml;

            //添加系统消息
            var html = '';
            html += '<div class="msg-system">';
            html += user.username;
            html += (action == 'login') ? ' 加入了聊天室' : ' 退出了聊天室';
            html += '</div>';
            var section = d.createElement('section');
            section.className = 'system J-mjrlinkWrap J-cutMsg';
            section.innerHTML = html;
            this.msgObj.appendChild(section);
            this.scrollToBottom();
        },

        init: function (username) {
            /*
             客户端根据时间和随机数生成uid,这样会使聊天室用户名称出现重复
             实际项目中，如果是需要用户登录，那么应该采用用户的uid来做标识
             */
            this.userid = this.genUid();
            this.username = username;

            d.getElementById("showusername").innerHTML = this.username;
            this.scrollToBottom();

            //连接websocket后端服务器
            this.socket = io.connect();

            //告诉服务器端有用户登录
            this.socket.emit('login', {userid: this.userid, username: this.username});

            //监听新用户登录
            this.socket.on('login', function (msg) {
                CHAT.updateSysMsg(msg, 'login');
            });

            //监听用户退出
            this.socket.on('logout', function (msg) {
                CHAT.updateSysMsg(msg, 'logout');
            });

            //监听消息发送
            this.socket.on('message', function (msg) {
                var isme = (msg.userid == CHAT.userid) ? true : false;
                var contentDiv = '<div>' + msg.content + '</div>';
                var usernameDiv = '<span>' + msg.username + '</span>';

                var section = d.createElement('section');
                if (isme) {
                    section.className = 'user';
                    section.innerHTML = contentDiv + usernameDiv;
                } else {
                    section.className = 'service';
                    section.innerHTML = usernameDiv + contentDiv;
                }
                CHAT.msgObj.appendChild(section);
                CHAT.scrollToBottom();
            });

        }
    };



    //通过“回车”提交用户名
    d.getElementById("username").onkeydown = function (e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.usernameSubmit();
        }
    };

    //通过“回车”提交信息
    d.getElementById("content").onkeydown = function (e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.submit();
        }
    };
})();