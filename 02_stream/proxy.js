/*
 代理服务器：proxy.xxxx.com
 虚拟机宿主：10.66.220.146

 这两天安装一个Linux虚拟机，接下来需要通过 yum 来安装软件。
 因单位的网络需要通过代理才能访问外网，所以给yum增加了proxy设置：

 vi /etc/yum.conf

 添加下面的内容：
 proxy=http://user:password@proxy.xxxx.com:3000

 发现linux无法访问代理服务器，Linux虚拟机只能访问宿主host所在的网段。
 索性自己搭一个proxy来做透明转发，用node.js来写吧，用stream.pipe()透传就OK。
 关键是传递给proxy服务器的认证信息如何传过去。
 */

var http = require('http');
var proxy = http.createServer(function (request, response) {
    var options = {
        host: '127.0.0.1', // 代理服务器地址 proxy.xxxx.com
        port: 80,		   // 代理服务器端口 81
        path: request.url,
        method: request.method,
        headers: {
            // 如果代理服务器需要认证
            'Proxy-Authentication': 'Base ' + new Buffer('user:password').toString('base64')
            // user:password 替换为代理服务器用户名和密码
        }
    };

    http.request(options, function (res) {
        res.pipe(response); // 这个pipe很喜欢
    }).end();
});
proxy.listen(3000);

/*
 启动 node proxy.js 后，用curl测试：
 curl -x localhost:3000 www.baidu.com 工作正常

 修改下 yum.conf
 vi yum.conf

 添加下面的内容：
 proxy=http://10.66.220.146:3000/

 现在可以在Linux里面 yum install 了！
 */