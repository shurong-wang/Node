// Model
var Book = require("./BookModel");

var cond = {
    // 还可以使用 $and
    $or: [
        // 除了相等，还有大于 $gt ，大于等于 $gte ，小于 $lt ，小于等于 $lte，不等于 $ne
        {author: 'Jame'},
        {author: 'Jim'}
    ]
};
Book.find(cond, function (err, docs) {
    if (err) {
        console.log('Find by cond err: ', err)
        return;
    }

    console.log('condition:', cond, '\nresult:', docs);
});

Book.where(cond).count(function (err, count) {
    if (err)
        return handleError(err);
    console.log('\nthere are %d books', count);
})
