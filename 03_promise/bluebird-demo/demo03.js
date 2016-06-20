var Promise = require("bluebird");
var fs = require("fs");

console.log('========================================= Promise test start =========================================\n');

// 将方法 Promise 化
var readFileAsync = Promise.promisify(fs.readFile);

// Promise.spread([Function fulfilledHandler] [, Function rejectedHandler ]) -> Promise
Promise.delay(0).then(function () {
    return [
        readFileAsync('./files/file1.txt', 'utf-8'),
        readFileAsync('./files/file2.txt', 'utf-8'),
        readFileAsync('./files/file3.txt', 'utf-8')
    ];
}).spread(function (file1, file2, file3) {
    console.log(file1);
    console.log(file2);
    console.log(file3);
    console.log(file1 + file2 + file3);
}).catch(function (e) {
    console.log(e);
}).finally(function () {
    console.log('\n');
    console.log('finally execute');
    console.log('------------------------------------------ 3. spread end -----------------------------------------\n');
});

console.log('========================================== Promise test end ==========================================\n');