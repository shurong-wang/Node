/**
 * 后台发送 http 请求
 */
var http = require('http');
var querystring = require('querystring');
var postData = querystring.stringify({
    'content': '要是能把PPT和源码上传就完美啦！',
    'mid': 8837,
});

var options = {
    hostname: 'www.imooc.com',
    port: 80,
    path: '/course/docomment',
    method: 'POST',
    headers: {
        //这部分需要填写自己的请求头数据
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Length': postData.length,  // 注意：此处需要设置实际请求数据长度
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'imooc_uuid=1a22320e-6dd1-4f90-a475-3806392825dd; imooc_isnew_ct=1465355223; loginstate=1; apsid=IxMDczMTBjYzFlN2ZkYjljZmQyNmQyMzU0N2U4OGYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMTM2NDc2MQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0NDI1NzAzMDNAcXEuY29tAAAAAAAAAAAAAAAAAAAAAGFjZDYzOTZiNDE5OWEwZTYwNTljYmI0ZGVmZjBiOWYzKLdYVyi3WFc%3DNG; last_login_username=442570303%40qq.com; PHPSESSID=pic2i7ojvtjge2aqf84he7eue6; jwplayer.qualityLabel=è¶æ¸; IMCDNS=0; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1465555175,1465556371,1465565632,1465612104; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1465615903; imooc_isnew=2; cvde=575b77504a4ff-15',
        'Host': 'www.imooc.com',
        'Origin': 'http://www.imooc.com',
        'Pragma': 'no-cache',
        'Referer': 'http://www.imooc.com/video/8837',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
    }
};

var req = http.request(options, function (res) {
    console.log('Status: ' + res.statusCode);
    console.log('headers: ' + JSON.stringify(res.headers));

    //为data事件注册回调函数来接受数据
    res.on('data', function (chunk) {
        console.log(Buffer.isBuffer(chunk));
        console.log(typeof chunk);
    });
    //当数据接受完毕，网络连接关闭，触发end事件
    res.on('end', function () {
        console.log('评论完毕!');
    });
});

//当有错误发生时候
req.on('error', function (e) {
    console.log("error! " + e.message);
});

//把要提交的数据写入请求体
req.write(postData);

//完成请求
req.end();

