// Model
var Book = require("./BookModel");

//*
Book.remove({author: 'Jim'}, function (err, docs) {
    if (err) {
        console.log('remove err:', err);
        return;
    }
    console.log(docs.result);
});
//*/

/*
Book.findOne({author: 'Jim'}, function (err, doc) {
    if (err) {
        console.log('findOne err:', err);
        return;
    }
    if (doc) {
        doc.remove(function (err, docs) {
            if (err) {
                console.log('remove err:', err);
                return;
            }
            console.log(docs);
        });
    }
});
 //*/