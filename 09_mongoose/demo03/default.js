var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/part10');

var UserSchema = new mongoose.Schema({
    nickname: {
        type: String,
        // 固定值的默认值
        default: 'new user'
    },
    regTime: {
        type: Date,
        // 根据时间生成的默认值
        default: Date.now
    }
});

var User = mongoose.model('User', UserSchema);

var user = new User();

console.log('user: ', user);