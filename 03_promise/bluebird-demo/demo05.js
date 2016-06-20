var Promise = require("bluebird");
var fs = require("fs");

console.log('========================================= Promise test start =========================================\n');

// 将方法 Promise 化
var readFileAsync = Promise.promisify(fs.readFile);

// Promise.all() -> Promise
// 参数为 array，array 元素需要 Promise 化，全部成功返回的也为 array
Promise.all([
    readFileAsync('./files/file1.txt', 'utf-8'),
    readFileAsync('./files/file2.txt', 'utf-8'),
    readFileAsync('./files/file3.txt', 'utf-8')
]).then(function (result) {
    console.log("all result: ", {}.toString.apply(result), result);
    console.log("all element: ", {}.toString.apply(result[0]), result[0]);
}).finally(function () {
    console.log('-------------------------------------- 5.1 Promise.all end ---------------------------------------\n');
});


// Promise.props() -> Promise
// 类似于.all()，但参数为 object，object 属性值需要 Promise 化，全部成功返回值也为 object
Promise.props({
    rfProp1: readFileAsync('./files/file1.txt', 'utf-8'),
    rfProp2: readFileAsync('./files/file2.txt', 'utf-8'),
    rfProp3: readFileAsync('./files/file3.txt', 'utf-8')
}).then(function (result) {
    console.dir("props result: ", {}.toString.apply(result), result);
    console.log("props element: ", {}.toString.apply(result.rfProp1), result.rfProp1);
}).finally(function () {
    console.log('------------------------------------ 5.2 Promise.props end ------------------------------------\n');
});


// Promise.settle() -> Promise
// 参数为 array，array 元素需要 Promise 化，全部成功返回的也为 array，但 array 元素为 PromiseInspection 类型
Promise.settle([
    readFileAsync('./files/file1.txt', 'utf-8'),
    readFileAsync('./files/file2.txt', 'utf-8'),
    readFileAsync('./files/file3.txt', 'utf-8')
]).then(function (result) {
    console.log("settle result: ", {}.toString.apply(result), result);
    console.log("settle element: ", {}.toString.apply(result[0]), result[0]);
}).finally(function () {
    console.log('------------------------------------ 5.3 Promise.settle end ------------------------------------\n');
});

console.log('========================================== Promise test end ==========================================\n');