// https://www.npmjs.com/package/mongoose-paginate
// npm install mongoose-paginate

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

mongoose.connect("mongodb://localhost/part9");

var BookSchema = new mongoose.Schema({
    name: String,
    author: String,
    publishTime: Date
});
BookSchema.plugin(mongoosePaginate);

var Book = mongoose.model("Book", BookSchema);

var query = {author: 'Jim'};
var options = {
    select: 'name author',
    sort: {publishTime: -1},
    limit: 5, // 每页 n 条
    page: 1   // 第 n 页
};
Book.paginate(query, options).then(function (result) {
    console.log(result);
});