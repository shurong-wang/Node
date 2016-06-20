var Movie = require('../models/movie');
var Comment = require('../models/comment.js');
var Category = require('../models/category.js');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

// Upload poster middleware
exports.savePoster = function (req, res, next) {
  var posterData = req.files.uploadPoster;
  var filePath = posterData.path;
  var originalFilename = posterData.originalFilename;
  if (originalFilename) {
    fs.readFile(filePath, function (err, data) {
      var timestamp = Date.now();
      var type = posterData.type.split('/')[1];
      var poster = timestamp + '.' + type;
      var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);

      fs.writeFile(newPath, data, function (err) {
        req.poster = poster;
        next();
      });
    });
  } else {
    next();
  }
};

exports.list = function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err);
      return;
    }
    res.render('movieList', {
      title: '电影列表',
      movies: movies
    })
  });
};

exports.add = function (req, res) {
  Category
    .find({})
    .exec(function (err, categories) {
      res.render('movieManage', {
        title: '添加电影',
        movie: {},
        categories: categories
      });
    });
};

exports.update = function (req, res) {
  var mid = req.params.id;
  if (mid) {
    Movie.findById(mid, function (err, movie) {
      Category.find({}, function (err, categories) {
        if (err) {
          console.log(err);
          return;
        }
        res.render('movieManage', {
          title: '编辑电影',
          movie: movie,
          categories: categories
        });
      });
    });
  }
};

exports.insert = function (req, res) {
  var movieObj = req.body.movie;
  var mid = movieObj._id;
  var cid = movieObj.category;
  var newMovie;

  if (req.poster) {
    movieObj.poster = req.poster;
  }

  if (mid) {
    Movie.findById(mid, function (err, oldMovie) {
      if (err) {
        console.log(err);
        return;
      }

      // remove old movie from category
      var oldCid = oldMovie.category;
      Category.findById(oldCid, function (err, category) {
        var index = category.movies.indexOf(mid);
        if (index > -1) {
          // delete element from array
          category.movies.splice(index, 1);
          category.save(function (err, category) {
            console.log(err);
            return;
          });
        }
      });

      // get new movie object
      newMovie = _.extend(movie, movieObj);

      // save new movie
      newMovie.save(function (err, movie) {
        if (err) {
          console.log(err);
          return;
        }

        // add new movie to category
        Category.findById(cid, function (err, category) {
          // add new element to array
          category.movies.push(movie._id);
          category.save(function (err, category) {
            if (err) {
              console.log(err);
              return;
            }
            res.redirect('/movie/' + movie._id);
          });
        });
      });
    });

  } else {

    newMovie = new Movie(movieObj);
    var cateName = movieObj.categoryName;
    newMovie.save(function (err, movie) {
      if (err) {
        console.log(err);
        return;
      }

      // add new movie to existing category
      if (cid) {
        Category.findById(cid, function (err, category) {
          // add new element to array
          category.movies.push(movie._id);
          category.save(function (err, category) {
            if (err) {
              console.log(err);
              return;
            }
            res.redirect('/movie/' + movie._id);
          });
        });

      } else if (cateName) {

        // add new movie to new category
        var newCategory = new Category({
          name: cateName,
          movies: [movie._id]
        });
        newCategory.save(function (err, category) {
          // add category to movie
          movie.category = category._id;
          movie.save(function (err, movie) {
            if (err) {
              console.log(err);
              return;
            }
            res.redirect('/movie/' + movie._id);
          });
        });
      }
    });
  }
};

exports.detail = function (req, res) {
  var mid = req.params.id;

  // pv statistics
  Movie.update({_id: mid}, {$inc: {pv: 1}}, function (err) {
    if (err) {
      console.log(err);
      return;
    }
  });

  // get movie detail
  Movie.findById(mid, function (err, movie) {
    if (err) {
      console.log(err);
      return;
    }

    // get movie comments
    Comment
      .find({movie: mid})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function (err, comments) {
        res.render('movieDetail', {
          title: '电影详情',
          movie: movie,
          comments: comments
        });
      });
  });

};

exports.del = function (req, res) {
  var mid = req.query.id;
  if (mid) {
    Movie.remove({_id: mid}, function (err, movie) {
      if (err) {
        console.log(err);
        return;
      } else {
        res.json({success: 1});
      }
    });
  }

};
