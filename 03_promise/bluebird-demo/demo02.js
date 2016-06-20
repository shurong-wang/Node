var Promise = require("bluebird");
var fs = require("fs");

console.log('========================================= Promise test start =========================================\n');

// 将方法 Promise 化
var readFileAsync = Promise.promisify(fs.readFile);

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
    console.log('------------------------------------ 2. Promise.promisify end ------------------------------------\n');
});

console.log('========================================== Promise test end ==========================================\n');