var User = require('../models/user');

exports.signup = function (req, res) {
  var _user = req.body.user;

  // check user name whether  exists
  User.findOne({name: _user.name}, function (err, user) {
    if (err) {
      console.log(err);
      return;
    }
    if (user) {
      console.log('用户 ' + user.name + ' 已存在');
      return res.redirect('/signin');
    } else {
      var newUser = new User(_user);
      newUser.save(function (err, user) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('用户 ' + user.name + ' 注册成功');
        res.redirect('/');
      });
    }
  });
};

exports.signin = function (req, res) {
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;

  User.findOne({name: name})
      .exec(function (err, user) {
        if (err) {
          console.log(err);
          return;
        }
        if (!user) {
          console.log('用户 ' + name + ' 不存在');
          return res.redirect('/signup');
        }
        user.comparePassword(password, function (err, isMatch) {
          if (err) {
            console.log(err);
            return;
          }
          if (isMatch) {
            req.session.user = user;
            return res.redirect('/');
          } else {
            console.log('密码错误');
            res.redirect('/signin');
          }

        });

      });

};

exports.userList = function (req, res) {
  User.fetch(function (err, users) {
    if (err) {
      console.log(err);
      return;
    }
    res.render('userList', {
      title: '用户列表',
      users: users
    })

  });
};

exports.logout = function (req, res) {
  delete req.session.user;
  // delete app.locals.user;
  res.redirect('/');

};

exports.showSignin = function (req, res) {
  res.render('signin', {
    title: '登录页面'
  });
}

exports.showSignup = function (req, res) {
  res.render('signup', {
    title: '注册页面'
  });
}

// user signin middleware
exports.signinRequired = function (req, res, next) {
  var user = req.session.user;
  if (!user) {
    return res.redirect('/signin');
  }
  next();
};

// admin signin middleware
exports.adminRequired = function (req, res, next) {
  var user = req.session.user;
  if (!user.role || user.role <= 10) {
    console.log('权限错误');
    return res.redirect('/signin');
  }
  next();
};






