var http = require('http');
var jade = require('jade');

http.createServer(function (req, res) {
    /*
     // 1. jade.compile
     var fn = jade.compile('div #{course}', {});
     var html = fn({course: 'jade'});
     //*/

    /*
     // 2. jade.render
     var html = jade.render('div #{course}', {course: 'jade render'});
     //*/

    //*
    // 3. jade.renderFile
    var html = jade.renderFile('./template/index.jade', {course: 'jade renderFile', pretty: true});
    //*/

    res.writeHead(200, {
        'Content-Type': 'text/html'
    })
    res.end(html);
}).listen(3000, '127.0.0.1', function () {
    console.log('Server running at 3000 ...');
});
