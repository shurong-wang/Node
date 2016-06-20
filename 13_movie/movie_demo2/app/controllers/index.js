var Movie = require('../models/movie');
var Category = require('../models/category.js');

exports.index = function (req, res) {
  Category
    .find({})
    .populate({path: 'movies', options: {limit: 5}})
    .exec(function (err, categories) {
      if (err) {
        console.log(err);
        return;
      }
      res.render('index', {
        title: '首页',
        categories: categories
      });
    });
};

exports.search = function (req, res) {
  var cid = req.query.cat;
  var q = req.query.q;

  var page = parseInt(req.query.p) || 0;
  var count = 3;
  var start = page * count;
  var end = start + count;

  if (cid) {
    Category
      .findOne({_id: cid})
      .populate({
        path: 'movies'
      })
      .exec(function (err, category) {
        if (err) {
          console.log(err);
          return;
        }

        var movies = category.movies || [];
        var results = movies.slice(start, end);
        var totalPage = Math.ceil(movies.length / count);

        res.render('movieResults', {
          title: '搜索结果',
          movies: results,
          keyword: category.name,
          currentPage: page + 1,
          totalPage: totalPage,
          query: 'cat=' + cid
        });
      });

  } else {

    var qReg = new RegExp(q + '.*', 'i');
    console.log(qReg);
    Movie
      .find({title: qReg})
      .exec(function (err, movies) {
        if (err) {
          console.log(err);
          return;
        }
        var results = movies.slice(start, end);
        var totalPage = Math.ceil(movies.length / count);
        res.render('movieResults', {
          title: '搜索结果',
          movies: results,
          keyword: q,
          currentPage: page + 1,
          totalPage: totalPage,
          query: 'q=' + q
        });
      });
  }

};
