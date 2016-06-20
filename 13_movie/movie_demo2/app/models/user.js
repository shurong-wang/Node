var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs'); // password + salt

// UserSchema
var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number, // =0 normal | =1 verified | =2 senior | >10 admin | >50 super root
    default: 0
  },
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
UserSchema.pre('save', function (next) {
  var user = this;
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.updateAt = Date.now();
  }
  var hash = bcrypt.hashSync(this.password);
  this.password = hash;
  next();
});

// Instance methods
UserSchema.methods = {
  comparePassword: function (_password, cb) {
    var hash = this.password;
    var isMatch = bcrypt.compareSync(_password, hash);
    cb(null, isMatch);
  }
};

// Statics methods
UserSchema.statics = {
  fetch: function (cb) {
    return this.find({}).sort('meta.updateAt').exec(cb);
  },
  findById: function (id, cb) {
    return this.findOne({_id: id}).exec(cb);
  }

};

// UserModel
module.exports = mongoose.model('User', UserSchema);


