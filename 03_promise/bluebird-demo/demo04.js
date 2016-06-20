var Promise = require("bluebird");
var fs = require("fs");

console.log('========================================= Promise test start =========================================\n');

// 将方法 Promise 化
var readFileAsync = Promise.promisify(fs.readFile);

// Promise.join(Promise|Thenable|value promises..., Function handler) -> Promise
var rf1 = readFileAsync('./files/file1.txt', 'utf-8');
var rf2 = readFileAsync('./files/file2.txt', 'utf-8');
var rf3 = readFileAsync('./files/file3.txt', 'utf-8');

Promise.join(rf1, rf2, rf3, function (file1, file2, file3) {
    console.log(file1);
    console.log(file2);
    console.log(file3);
    console.log('\n');
    return file1 + file2 + file3;
}).then(function (content) {
    console.log("join: " + content);
    console.log('\n');
}).finally(function () {
    // Synchronous inspection 同步检测

    // Promise.isFulfilled() -> boolean
    console.log("success:" + rf1.isFulfilled());
    // Promise.isRejected() -> boolean
    console.log("fail:" + rf1.isRejected());
    // Promise.isPending() -> boolean
    console.log("Pending:" + rf1.isPending());
    // Promise.value() -> dynamic
    if (rf1.isFulfilled()) {
        // 成功的结果,一般使用时先判定是否完成
        console.log(rf1.value());
    }
    // Promise.reason() -> dynamic
    if (rf1.isRejected()) {
        // 失败原因，同样使用时先判定是否失败
        console.log(rf1.reason());
    }
    console.log('------------------------------------------ 4. join end -------------------------------------------\n');
});

console.log('========================================== Promise test end ==========================================\n');