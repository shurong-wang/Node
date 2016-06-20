var fs = require('fs');

fs.readFile('./directory/Promise对象简介.txt', 'utf-8', function(err, asyncData) {
    if(err) {
        console.error('\n一. readFile error: ', err);
    } else {
        console.log('\n一. readFile content: ', asyncData);
    }
});

console.log('\n二. after readFile, before readFileSync');

var syncData = fs.readFileSync('./directory/JS异步编程的4种方法.txt', 'utf-8');

console.log('\n三. readFileSync content: ', syncData);

console.log('\n四. after readFileSync');
