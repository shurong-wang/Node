var Promise = require("bluebird");
var fs = require("fs");

console.log('========================================= Promise test start =========================================\n');
// 新建一个 Promise 对象
// new Promise(function(function resolve, function reject) resolver) -> Promise
var readFileAsync = function (filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, function (err, data) {
            if (err) {
                reject(err); // 失败回调
            } else {
                resolve(data); // 成功回调
            }
        });
    });
};

readFileAsync('./files/file1.txt').then(function (file1) {
    console.log('file1 content: ', file1);
    return readFileAsync('./files/file2.txt');
}).then(function (file2) {
    console.log('file2 content: ', file2);
    return readFileAsync('./files/file3.txt');
}).then(function (file3) {
    console.log('file3 content: ', file3);
}).catch(function (err) {
    console.error(err)
}).finally(function () {
    console.log('\n');
    console.log('finally execute');
    console.log('--------------------------------------- 1. new Promise end ---------------------------------------\n');
});

console.log('========================================== Promise test end ==========================================\n');