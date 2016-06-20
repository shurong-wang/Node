// Model
var Book = require("./BookModel");

// 静态调用
Book.find({}, function (err, docs) {
    if (err) {
        console.log('err:', err);
        return;
    }

    console.log('result:', docs);
});