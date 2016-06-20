// Model
var Book = require("./BookModel");

// Entity
var book = new Book({
    name: "MEAN Web Development",
    author: "Green",
    publishTime: new Date()
});

// 修改属性
book.author = 'Jim';

// 执行 CURD
book.save(function (err) {
    console.log('save status:', err ? 'failed' : 'success');
});