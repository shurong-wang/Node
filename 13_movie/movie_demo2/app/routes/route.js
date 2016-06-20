// Middleware
var multipart = require('connect-multiparty'); // multipart form
var multiMid = multipart(); // for upload files

// s
var Index = require('../controllers/index.js');
var Movie = require('../controllers/movie.js');
var User = require('../controllers/user.js');
var Comment = require('../controllers/comment.js');
var Category = require('../controllers/category.js');

module.exports = function (app) {
  //#######
  // Middleware for Routes
  //#######
  app.use(function (req, res, next) {
    var _user = req.session.user;
    app.locals.user = _user;
    next();
  });

  //#######
  // routes
  //#######

  //-- Index
  app.get('/', Index.index);
  app.get('/search', Index.search);

  //-- Movie
  app.get('/movie/:id', Movie.detail);

  //-- User
  app.get('/logout', User.logout);
  app.get('/signin', User.showSignin);
  app.get('/signup', User.showSignup);
  app.post('/signup', User.signup);
  app.post('/signin', User.signin);

  //-- Comments
  app.post('/comment', User.signinRequired, Comment.add);

  //-- Admin-User
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.userList);
  app.get('/admin/user/:id', User.signinRequired, User.adminRequired, User.userList);
  app.get('/admin/user/update/:id', User.signinRequired, User.adminRequired, User.userList);
  app.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.userList);

  //-- Admin-Category
  app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
  app.get('/admin/category/add', User.signinRequired, User.adminRequired, Category.add);
  app.post('/admin/category/add', User.signinRequired, User.adminRequired, Category.insert);

  //-- Admin-Movie
  app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
  app.get('/admin/movie/add', User.signinRequired, User.adminRequired, Movie.add);
  app.post('/admin/movie/add', multiMid, User.signinRequired, User.adminRequired, Movie.savePoster, Movie.insert);
  app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
  app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);

};
