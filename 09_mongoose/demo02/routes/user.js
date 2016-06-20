var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();  // 路由
var User = mongoose.model('User');  // 模型

/*
 127.0.0.1:3000/user
 */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
    next();
});

/*
 127.0.0.1:3000/user/test
 */
router.get('/test', function (req, res, next) {
    var user = new User({
        uid: 1,
        username: 'Snowden'
    });

    user.save(function (err) {
        if (err) {
            res.end('Error');
            return next();
        }

        User.find({}, function (err, docs) {
            if (err) {
                res.end('Error');
                return next();
            }

            res.json(docs);
        });
    });
});

module.exports = router;
