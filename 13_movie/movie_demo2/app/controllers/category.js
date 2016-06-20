var Movie = require('../models/movie');
var Category = require('../models/category.js');
var _ = require('underscore');

exports.list = function (req, res) {
  Category.fetch(function (err, categories) {
    if (err) {
      console.log(err);
      return;
    }
    res.render('categoryList', {
      title: '分类列表',
      categories: categories
    })
  });
};

exports.add = function (req, res) {
  res.render('categoryManage', {
    title: '电影分类',
    category: {}
  });

};

exports.insert = function (req, res) {
  var _category = req.body.category;
  var category = new Category(_category);

  category.save(function (err, category) {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect('/admin/category/list');
  });

};

exports.del = function (req, res) {
  var id = req.query.id;
  if (id) {
    Movie.remove({_id: id}, function (err, movie) {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log('电影《' + movie.title + '》删除成功！' );
        res.json({success: 1});
      }
    });
  }
};
