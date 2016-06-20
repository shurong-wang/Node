var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/part10');

var OrderSchema = new mongoose.Schema({
    count: {
        type: Number,
        // 设置是否必须的校验
        required: true,

        // 预定义验证器 -- 验证最大值
        max: 1000,
        // 预定义验证器 -- 验证最小值
        min: 10
    },
    status: {
        type: String,
        // 预定义验证器 -- 验证可选值
        enum: ['created', 'success', 'failed']
    },
    desc: {
        type: String,
        // 正则验证器 -- 特定匹配
        match: /book/g,
        // 自定义验证器 -- 验证长度
        validate: function (desc) {
            return desc.length >= 10;
        }
    }
});

var Order = mongoose.model('Order', OrderSchema);

var order = new Order();
order.count = 8;    // 测试校验
order.status = 'created';
order.desc = 'this is a great book';
order.save(function (err) {

    if (err) {
        return console.log('save failed:', err);
    }

    console.log('save success');
});