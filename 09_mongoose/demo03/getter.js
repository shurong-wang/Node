var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/part10');

var User = mongoose.model('User', {
    blog: {
        type: String,
        // 自定义修饰符
        //自定义的 getter 修饰符
        get: function (url) {
            if (!url)
                return url;

            if (0 !== url.indexOf('http://') && 0 !== url.indexOf("https://"))
                url = 'http://' + url;

            return url;
        }
    }
});

var user = new User({
    blog: 'www.jikexueyuan.com/course/1905_1.html'
});

user.save(function (err) {
    if (err) {
        return console.log('save error:', err);
    }

    console.log('blog url: ', user.blog);
});