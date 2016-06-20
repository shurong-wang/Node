var Promise = require("bluebird");
var fs = require("fs");

console.log('========================================= Promise test start =========================================\n');

// 将方法 Promise 化
var readFileAsync = Promise.promisify(fs.readFile);

// Promise.reduce(Function reducer [, dynamic initialValue]) -> Promise
// 参数为 array（元素不需要 Promise 化），在回调函数中 Promise 化，近似数组的 reduce 方法
// total 为返回的组装值，element 为 item，'hello ' 为初始值
Promise.reduce([
    './files/file1.txt',
    './files/file2.txt',
    './files/file3.txt'
], function (total, element) {
    return readFileAsync(element, "utf8").then(function (contents) {
        console.log("reduce total1: ", {}.toString.apply(total), total);
        console.log("reduce element: ", {}.toString.apply(element), element);
        console.log("reduce contents: ", {}.toString.apply(contents), total);
        console.log("\n");

        return total + contents;
    });
}, 'hello ').then(function (total) {
    console.log("reduce total2: ", {}.toString.apply(total), total);

}).finally(function () {
    console.log('-------------------------------------- 7. Promise.reduce end -------------------------------------\n');
});

console.log('========================================== Promise test end ==========================================\n');