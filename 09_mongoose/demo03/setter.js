var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/part10');

var User = mongoose.model('User', {
    nickname: {
        type: String,
        // 预定义的修饰符
        trim: true
    },
    blog: {
        type: String,
        // 自定义修饰符
        // 自定义的 setter 修饰符
        set: function (url) {
            if (!url)
                return url;

            if (0 !== url.indexOf('http://') && 0 !== url.indexOf('https://'))
                url = 'http://' + url;
            
            return url;
        }
    }
});

var user = new User({
    nickname: " Valeri   ",
    blog: 'mongoosejs.com'
});

console.log('user:', user);