/**
 * MongoDB 是文档型数据库，所以它没有关系型数据库的 join 特性
 * 为了解决这个问题，mongoose 封装了一个 populate 功能
 * 使用 populate 可以实现在一个 document 中填充其他 collection(s) 的 document(s)

 * 在定义 Schema 的时候，设置某个关联字段(field)引用(ref)另一个 Schema 的 Model
 * 在获取 document 的时候，使用 populate 功能即可找到引用的另一个 document ，并替换掉原来关联字段(field)的内容
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

mongoose.connect('mongodb://localhost/populate-test', function (err) {
    if (err) throw err;
    console.log('\nRunning mongoose version %s ...\n', mongoose.version);
    createData();
});

/**
 *
 * 创建三个 Model : User(用户), Post(帖子), Comment(评论)
 *
 * 三个 Model 的关系:
 *  user --[has many]--> post
 *  post --[has one]--> user, post -- [has many] --> comment
 *  comment --[has one]-->post, comment --[has one]--> post
 */

// 用户
var UserSchema = new Schema({
    name: String,
    // posts 字段对应是一个 ObjectId 的数组
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post' // field-posts ref Model-Post
    }]
});
var User = mongoose.model('User', UserSchema);

// 帖子
var PostSchema = new Schema({
    poster: {
        type: Schema.Types.ObjectId,
        ref: 'User' // field-poster ref Model-User
    },
    // comments 字段对应是一个 ObjectId 的数组
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment' // field-comments ref Model-Comment
    }],
    title: String
});
var Post = mongoose.model('Post', PostSchema);

// 评论
var CommentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post"  // field-post ref Model-Post
    },
    commenter: {
        type: Schema.Types.ObjectId,
        ref: 'User'  // field-commenter ref Model-User
    },
    content: String
});
var Comment = mongoose.model('Comment', CommentSchema);




// Query#populate examples
// 语法：Query.populate(path, [select], [model], [match], [options])

// 根据"用户"查询"帖子"
function example1() {

    User.find()
        .populate('posts', 'title', null, {}, {sort: {title: -1}})
        .exec(function (err, docs) {
            console.log('\n');

            console.log(docs[0].posts[0].title);    // post-by-Tom
        });

    User.findOne({name: 'David'})
        .populate({path: 'posts', select: {title: 1}, options: {sort: {title: -1}}})
        .exec(function (err, doc) {
            console.log('\n');

            console.log(doc.posts[0].title);        // post-by-David
        });
}

// 根据"帖子"查询"发帖人"和"评论"
function example2() {

    Post.findOne({title: 'post-by-Tom'})
        .populate('poster comments', '-_id')
        .exec(function (err, doc) {
            console.log('\n');

            console.log(doc.poster.name);           // Tom
            console.log(doc.poster._id);            // undefined

            console.log(doc.comments[0].content);  // comment-by-Lucy
            console.log(doc.comments[0]._id);      // undefined
        });

    Post.findOne({title: 'post-by-Tom'})
        .populate({path: 'poster comments', select: '-_id'})
        .exec(function (err, doc) {
            console.log('\n');

            console.log(doc.poster.name);           // Tom
            console.log(doc.poster._id);            // undefined

            console.log(doc.comments[0].content);  // comment-by-Lucy
            console.log(doc.comments[0]._id);      // undefined
        });

    Post.findOne({title: 'post-by-Tom'})
        .populate(['poster', 'comments'])
        .exec(function (err, doc) {
            console.log('\n');

            console.log(doc.poster.name);          // Tom
            console.log(doc.comments[0].content);  // comment-by-Lucy
        });

    Post.findOne({title: 'post-by-Tom'})
        .populate([
            {path: 'poster', select: '-_id'},
            {path: 'comments', select: '-content'}
        ])
        .exec(function (err, doc) {
            console.log('\n');

            console.log(doc.poster.name);          // Tom
            console.log(doc.poster._id);           // undefined

            console.log(doc.comments[0]._id);      // 会打印出对应的 comment id
            console.log(doc.comments[0].content);  // undefined
        });
}


// Model#populate example
// 语法：Model.populate(docs, options, [cb(err,doc)])

// 根据"帖子"查询"发帖人"和"评论者"
function example3(done) {

    Post.find({title: 'post-by-Tom'})
        .populate('poster comments')
        .exec(function (err, docs) {
            var opts = [{
                path: 'comments.commenter',
                select: 'name',
                model: 'User'
            }];

            Post.populate(docs, opts, function (err, populatedDocs) {
                console.log('\n');

                console.log(populatedDocs[0].poster.name);                 // Tom
                console.log(populatedDocs[0].comments[0].commenter.name);  // Lucy

                done();
            });
        });

}


// Document#populate example
// 语法：Document.populate([path], [callback])

// 根据"用户"查询"帖子"
function example4(done) {

    User.findOne({name: 'Tom'})
        .exec(function (err, doc) {
            var opts = [{
                path: 'posts',
                select: 'title'
            }];

            doc.populate(opts, function (err, populatedDoc) {
                console.log('\n');

                console.log(populatedDoc.posts[0].title);  // post-by-Tom
                done();
            });
        });
}

// 删除集合，关闭连接
function done() {
    mongoose.connection.db.dropDatabase(function () {
        mongoose.connection.close();
    });
}




// 创建测试数据
function createData() {

    var userIds = [new ObjectId, new ObjectId, new ObjectId];
    var postIds = [new ObjectId, new ObjectId, new ObjectId];
    var commentIds = [new ObjectId, new ObjectId, new ObjectId];

    var users = [];
    var posts = [];
    var comments = [];

    users.push({
        _id: userIds[0],
        name: 'Tom',
        posts: [postIds[0]]
    });
    users.push({
        _id: userIds[1],
        name: 'Lucy',
        posts: [postIds[1]]
    });
    users.push({
        _id: userIds[2],
        name: 'David',
        posts: [postIds[2]]
    });

    posts.push({
        _id: postIds[0],
        title: 'post-by-Tom',
        poster: userIds[0],
        comments: [commentIds[0]]
    });
    posts.push({
        _id: postIds[1],
        title: 'post-by-Lucy',
        poster: userIds[1],
        comments: [commentIds[1]]
    });
    posts.push({
        _id: postIds[2],
        title: 'post-by-David',
        poster: userIds[2],
        comments: [commentIds[2]]
    });

    comments.push({
        _id: commentIds[0],
        content: 'comment-by-Lucy',
        commenter: userIds[1],
        post: postIds[0]
    });
    comments.push({
        _id: commentIds[1],
        content: 'comment-by-David',
        commenter: userIds[2],
        post: postIds[1]
    });
    comments.push({
        _id: commentIds[2],
        content: 'comment-by-Tom',
        commenter: userIds[1],
        post: postIds[2]
    });

    User.create(users, function (err, docs) {
        Post.create(posts, function (err, docs) {
            Comment.create(comments, function (err, docs) {
                // run example on here

                // example1(done);
                // example2(done);
                example3(done);
                // example4(done);
            });
        });
    });

}