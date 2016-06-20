// Model
var Book = require("./BookModel");

Book.count({author: 'Jim'}, function (err, count) {
    if (err)
        return handleError(err);
    console.log('there are %d books', count);
});

