var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// CategorySchema
var CategorySchema = new Schema({
  name: String,
  movies: [{
    type: ObjectId,
    ref: 'Movie'
  }],
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
    
  }
  
});

// Middleware
CategorySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  
  // MUST !!! USE !!! next()!!!
  next();
  
});

// Statics methods
CategorySchema.statics = {
  fetch: function (cb) {
    return this.find({}).sort('meta.updateAt').exec(cb);
  },
  findById: function (id, cb) {
    return this.findOne({_id: id}).exec(cb);
  }
  
};

// CategoryModel
module.exports = mongoose.model('Category', CategorySchema);
