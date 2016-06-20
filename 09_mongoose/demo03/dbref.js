var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/part10');

// UserModel
var User = mongoose.model('User', {
    username: String
});
// NewsModel
var News = mongoose.model('News', {
    title: String,
    // DBRef 的定义: ref 指定外键引用的 Model
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User' // UserModel name
    }
});

// userEntity
var user = new User({
    username: 'WangZhe'
});
// userEntity
var news = new News({
    title: 'Node.js v6 Released!',
    author: user // userEntity object
});

// CURD
user.save(function (err) {
    if (err) {
        return console.log('save user failed:', err);
    }
    news.save(function (err) {
        if (err) {
            return console.log('save news failed:', err);
        }

        // 查询：使用 populate() 填充外键关联查询
        News.findOne().populate('').exec(function (err, doc) {
            console.log('\nafter populate: ', err, doc);
        });
        News.findOne().populate('author').exec(function (err, doc) {
            console.log('\nafter populate: ', err, doc);
        });
    });
});