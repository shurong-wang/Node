// Model
var Book = require("./BookModel");
var async = require('async');

var page = 2; // 查询第n页
var pageSize = 10; // 每页n条

paginate(page, pageSize, Book, '', {author: 'Jim'}, {publishTime: '-1'}, function (error, data) {
    if (error) {
        console.log(error);
        return;
    } else {
        var count = data.count;
        var records = data.records;
        var pageCount = data.pageCount;

        console.log(records);
        console.log('\n共' + count + '条记录');
        console.log('\n共' + pageCount + '页');
    }
});

// 分页函数
function paginate(page, pageSize, Model, populate, queryParams, sortParams, callback) {
    var start = (page - 1) * pageSize;
    var data = {
        pageNumber: page
    };
    async.parallel({
        // 查询记录总数
        count: function (done) {
            Model.count(queryParams).exec(function (err, count) {
                done(err, count);
            });
        },
        // 查询一页的记录
        records: function (done) {
            Model.find(queryParams)
                .skip(start)
                .limit(pageSize)
                .populate(populate)
                .sort(sortParams)
                .exec(function (err, docs) {
                    done(err, docs);
                });
        }
    }, function (err, docs) {
        data.count = docs.count;
        data.pageCount = Math.ceil(docs.count / pageSize); // 共n页
        data.records = docs.records; // 记录列表
        callback(err, data);
    });
};