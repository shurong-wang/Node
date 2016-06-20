var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/part10');

var BookSchema = new mongoose.Schema({
  name: String,
  isbn: Number
});

// 静态方法
BookSchema.statics.findByISBN = function(isbn, func){
  this.findOne({isbn: isbn}, function(err, doc){
    func(err, doc);
  });
};

// 实例方法
BookSchema.methods.print = function(){
  console.log('Book Information:');
  console.log('\tTitle:', this.name);
  console.log('\tISBN:', this.isbn);
};

var Book = mongoose.model('Book', BookSchema);

var book = new Book({
  name: 'MEAN Web Development',
  isbn: 9787100
});

book.save(function(err){
  if(err) {
    return console.log('save book failed', err);
  }

  Book.findByISBN(9787100, function(err, doc){
    console.log('findByISBN, err, doc:', err, doc);
  });

  book.print();
});