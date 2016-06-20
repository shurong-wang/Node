/**
 * Created by Snowden on 2016/6/12.
 */
const http = require("http");
const querystring = require("querystring");

var items = [];
const port = 3000;
const hostname = "127.0.0.1";

var server = http.createServer((req, res) => {
    if ("/" == req.url) {
        switch (req.method) {
            case "GET":
                showTodoList(res);
                break;
            case "POST":
                addTodoList(req, res);
                break;
            default:
                badRequest(res);
        }
    } else {
        notFound(res);
    }
});

server.listen(port, hostname, ()=> {
    console.log(`You are already at http://${hostname}:${port}/`);
});

const showTodoList = (res)=> {
    var html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8"><title>Todo List</title>
    </head>
	<body>
        <h1>Todo List</h1>
        <ul>
        ${
        items.map((item)=> {
            return `<li>${item}</li>`;
        }).join("")
        }
        </ul>
        <form method="post" action="/">
            <p><input type="text" name="item"></p>
            <p><input type="submit" value="add Item"></p>
        </form>
	</body>
	</html>
	`;

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Length", Buffer.byteLength(html));
    res.end(html);
};

const addTodoList = (req, res)=> {
    var body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk)=> {
        body += chunk
    });
    req.on("end", ()=> {
        var fields = querystring.parse(body);
        fields.item.length && items.push(fields.item);
        showTodoList(res);
    })
};

const notFound = (res)=> {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("no found");
};

const badRequest = (res)=> {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain");
    res.end("Bad Request");
};
