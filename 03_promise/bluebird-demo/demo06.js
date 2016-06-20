var Promise = require("bluebird");
var fs = require("fs");

console.log('========================================= Promise test start =========================================\n');

// 将方法 Promise 化
var readFileAsync = Promise.promisify(fs.readFile);

// Promise.some(array input, int count) -> Promise
// 第1个参数为 array，array 元素需要 Promise 化，全部成功返回的也为 array，第2个为返回值个数
// 返回结果最先成功的结果
Promise.some([
    readFileAsync('./files/file1.txt', 'utf-8'),
    readFileAsync('./files/file2.txt', 'utf-8'),
    readFileAsync('./files/file3.txt', 'utf-8')
], 2).spread(function (first, second) {
    console.log("some element: ", {}.toString.apply(first), first);
    console.log("some element: ", {}.toString.apply(second), second);
}).finally(function () {
    console.log('-------------------------------------- 6.1 Promise.some end --------------------------------------\n');
});


// Promise.map(Function mapper [, Object options]) -> Promise
// 参数为 array（元素不需要 Promise 化），在回调函数中 Promise 化，类似数组的 map 方法
Promise.map([
    './files/file1.txt',
    './files/file2.txt',
    './files/file3.txt'
], function (filename) {
    return readFileAsync(filename, 'utf-8');
}).then(function (result) {
    console.log("map result: ", {}.toString.apply(result), result);
    console.log("map element: ", {}.toString.apply(result[0]), result[0]);
}).finally(function () {
    console.log('-------------------------------------- 6.2 Promise.map end ---------------------------------------\n');
});

console.log('========================================== Promise test end ==========================================\n');