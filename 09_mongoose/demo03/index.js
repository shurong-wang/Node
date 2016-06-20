var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/part10');

var BookSchema = new mongoose.Schema({
    isbn: {
        type: Number,
        // 唯一索引
        unique: true
    },
    name: {
        type: String,
        // 辅助索引
        index: true
    }
});

var Book = mongoose.model('Book', BookSchema);

var book = new Book({
    isbn: 3517608,
    name: 'Pro Node.js for Developers'
});

book.save(function (err) {
    console.log('save status:', err ? 'failed' : 'success');
});