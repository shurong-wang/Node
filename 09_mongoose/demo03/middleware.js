var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/part10');

var ResellerSchema = new mongoose.Schema({
    address: String,
    mobile: String,
    email: String
});

// 前置处理中间件 Schema.pre()
ResellerSchema.pre('save', true, function (next, done) {
    console.log('This is ResellerSchema pre save middleware');
    next();
    done();
});

// 后置处理中间件 Schema.post()
ResellerSchema.post('save', function (next, done) {
    console.log('This is ResellerSchema post save middleware');
    done();
    // done 需要传给并行执行的方法或者过程
    // 当该并行执行的方法或过程完成执行之后，调用 done 以通知 mongoose 执行完成
});

var Reseller = mongoose.model('Reseller', ResellerSchema);

var reseller = new Reseller({
    address: '101st, People Read',
    mobile: '18966668888',
    email: 'wangzhe@yahoo.com'
});

reseller.save();