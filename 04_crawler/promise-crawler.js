var http = require('http');
var Promise = require('bluebird'); // 第三方 Promises 模块
var cheerio = require('cheerio');  // 爬虫分析模块
var BufferHelper = require('bufferhelper'); // buffer 组装模块
var iconv = require('iconv-lite'); // 字符转码模块

var baseUrl = 'http://www.imooc.com/learn/'; // 课程URL
var courseIds = [348, 637, 259, 75, 197]; // 课程ID

//爬取到的HTML页面集合 -- 注意：数组元素是异步填充的
var pagePromisesArr = [];

// 批量爬取课程页面
courseIds.forEach(function (cid) {
    pagePromisesArr.push(grabPageAsync((baseUrl + cid)));
});

// 异步爬取页面HTML
function grabPageAsync(url) {
    return new Promise(function (resolve, reject) {
        console.log('正在爬取 ' + url);

        http.get(url, function (res) {
            // 中文乱码问题：
            // http://www.infoq.com/cn/articles/nodejs-about-buffer
            var bufferHelper = new BufferHelper();

            res.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            });

            res.on('end', function () {
                console.log('爬取 ' + url + ' 成功');

                var fullBuffer = bufferHelper.toBuffer();
                var utf8Buffer = iconv.decode(fullBuffer, 'UTF-8');
                var html = utf8Buffer.toString()
                resolve(html);
            });
        }).on('error', function (e) {
            // 爬取成功
            reject(e);

            console.log('爬取 ' + url + ' 失败');
        });
    });
}

// 提取课程信息并打印
// Promise.all 要等 pagePromisesArr 数组异步填充完毕才执行 then 方法
Promise.all(pagePromisesArr).then(function (pages) {
    var coursesData = [];

    pages.forEach(function (html) {
        // 提取课程信息
        var courses = filterChapters(html);
        coursesData.push(courses);
    });
    // 打印课程信息
    printCourseInfo(coursesData);
});

// 提取课程信息
function filterChapters(html) {
    var $ = cheerio.load(html);
    var $chapters = $('.chapter');
    var title = $('.hd .l').text();
    var number = parseInt($($(".meta-value strong")[3]).text().trim(), 10);
    var courseData = {
        title: title,
        number: number,
        videos: []
    };

    var $chapter;
    var chapterTitle;
    var chapterData = {};
    var $videos;
    var $video;
    var videoTitle;
    var id;

    $chapters.each(function () {
        $chapter = $(this);
        chapterTitle = $chapter.find('strong').text();
        chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        };
        $videos = $chapter.find('.video').children('li');
        $videos.each(function () {
            $video = $(this).find('.studyvideo');
            videoTitle = $video.text();
            id = $video.attr('href').split('video/')[1];
            chapterData.videos.push({
                title: videoTitle,
                id: id
            })
        });
        courseData.videos.push(chapterData);
    });
    return courseData;
}

// 打印课程信息
function printCourseInfo(coursesData) {
    if(Object.prototype.toString.call(coursesData) == '[object Array]' && coursesData.length > 0){

        coursesData.forEach(function (courseData) {
            console.log('\n\n【' + courseData.number + '】人学过《' + courseData.title + '》');
            console.log('----------------------------------------------');

            courseData.videos.forEach(function (item) {
                console.log('\n' + item.chapterTitle);

                item.videos.forEach(function (video) {
                    console.log(' ' + video.title.trim());
                })
            });
        });
    }else{
        console.log('暂无课程信息');
    }
}

/*
// coursesData 数据格式：
{
    "title":"进击Node.js基础（二）",
    "number":19547,
    "videos":[
        {
            "chapterTitle":"第1章 从Promise 讲起",
            "videos":[
                {
                    "title":"1-1 前言 (00:52)",
                    "id":"11548"
                },
                {
                    "title":"1-2 先从一个牛逼闪闪的知识点 Promise 讲起 (17:05)",
                    "id":"11549"
                }
            ]
        },
        {
            "chapterTitle":"第2章 横扫 Nodejs API",
            "videos":[
                {
                    "title":"2-1 横扫 Nodejs API-Buffer的实例化 (06:59)",
                    "id":"11552"
                },
                {
                    "title":"2-2 横扫 Nodejs API-Buffer使用和源码解读 (26:34)",
                    "id":"11553"
                }
            ]
        }
    ]
}
*/