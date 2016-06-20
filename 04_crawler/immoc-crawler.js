/**
 * 简单 http 爬虫
 */
var http = require('http');
var cheerio = require('cheerio'); // cheerio 模块，像jquery一样操作DOM
var iconv = require('iconv-lite'); // 字符转码模块 

var url = "http://www.imooc.com/learn/348";

http.get(url, function (res) {
    var chunks = [], size = 0;
    res.on('data', function (chunk) {
        chunks.push(chunk);
        size += chunk.length;
    });

    res.on('end', function () {
        var fullBuffer = Buffer.concat(chunks, size);
        var utf8Buffer = iconv.decode(fullBuffer, 'UTF-8');
        var html = utf8Buffer.toString();
        var courseData = filterChapters(html);
        printCourseInfo(courseData);
    });
}).on('error', function () {
    console.log("获取课程数据出错！");
});

/*
    传输数据部分需要注意：buffer 的拼接容易出问题！

    例如以下写法：

    var data = "";
    res.on("data" , function(chunk){
        data += chunk;
    });

    如果爬取的数据的中文数据量比较小，一般显示是正常的。但当爬取的数据量较大时，很有可能出现部分汉字会乱码现象。

    产生原因：
    在默认的情况下 trunk 是一个 Buffer 对象，而 data += trunk 的实质上隐藏了 toString 的变换的：

    data = data.toString() + trunk.toString();

    由于汉字不是用一个字节来存储的，如果某一块 buffer 传输的恰好不完整，将会导致有被截破的汉字的存在，于是出现乱码。

    解决方法：
    先用一个数组把所有 buffer 保存起来，同时记录 buffer 的总长度。
    数据传输完毕的时，再通过 Buffer.concat 方法把所有 buffer 拼接。
    最后，用 toString 方法转成字符串，这时获取的 data 数据就是正确的了。

    var chunks = [], size = 0;
    res.on("data" , function(chunk){
        chunks.push(chunk);
        size += chunk.length;
    });
    res.on("end" , function(){
        var buffer = Buffer.concat(chunks, size);
        var html = buffer.toString();
    });

    // 在更细腻的连接方式:

    res.on('end', function () {
        var buffer = null;
        switch(buffers.length) {
            case 0:
                buffer = new Buffer(0);
                break;
            case 1:
                buffer = buffers[0];
                break;
            default:
                buffer = new Buffer(size);
                for (var i = 0, pos = 0, l = buffers.length; i < l; i++) {
                    var chunk = buffers[i];
                    chunk.copy(buffer, pos);
                    pos += chunk.length;
                }
            break;
        }
        var html = buffer.toString();
    });
*/


// 提取课程章节信息
function filterChapters(html) {
    //把html内容封装进$中 -- 关键步骤
    var $ = cheerio.load(html);

    //分析出包含所有章节的类名
    var $chapters = $('.chapter');
    //保存课程章节信息
    var courseData = [];
    //循环外定义的变量，避免反复声明
    var $chapter;
    var $videos;
    var $video;
    var chapterTitle;
    var chapterData;
    var videoTitle;
    var id;
    var adress;
    //循环提取数据
    $chapters.each(function (index, item) {
        $chapter = $(item);
        $videos = $chapter.find('li');
        chapterTitle = $chapter.find('strong').text();
        chapterData = {
            'chapterTitle': chapterTitle,
            'videos': []
        };
        $videos.each(function (index, item) {
            $video = $(item).find('.J-media-item');
            videoTitle = $video.text();
            id = $video.attr('href').split('video/')[1];
            adress = $video.attr('href');

            chapterData.videos.push({
                'title': videoTitle,
                'id': id,
                'adress': adress
            });
        });
        courseData.push(chapterData);
    });
    return courseData;
}

// 打印课程章节信息
function printCourseInfo(courseData) {
    var chapterTitle;
    var urlPre = 'URL:http://www.imooc.com';
    courseData.forEach(function (item) {
        chapterTitle = item.chapterTitle;
        console.log('\n' + chapterTitle + ':');

        item.videos.forEach(function (video) {
            console.log(' ID:【' + video.id + '】' + urlPre + video.adress + '  章节：' + video.title.trim());
        });
    });
}