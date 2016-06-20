var Comment = require('../models/comment.js');

exports.add = function (req, res) {
  var _comment = req.body.comment;
  var movieId = _comment.movie;
  if (_comment.cid) {
    Comment.findById(_comment.cid, function (err, comment) {
      var reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      };

      comment.reply.push(reply);

      comment.save(function (err, comment) {
        if (err) {
          console.log(err);
          return;
        }
        console.log('回复“' + comment.content + '”成功！' );
        res.redirect('/movie/' + movieId);
      });
    });
  } else {
    var comment = new Comment(_comment);
    comment.save(function (err, comment) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('评论“' + comment.content + '”成功！' );
      res.redirect('/movie/' + movieId);
    });
  }
}













