/**
 * Node.js文件操作
 *
 * 运行命令:
 * > node jsonHandler list
 * > node jsonHandler add [数据]
 */
var fs = require("fs");
var path = require("path");

// process.argv 命令行参数数组
// 执行命令：node jsonHandler list
// process.argv[0] 为 'node'
// process.argv[1] 为 'jsonHandler.js'
// process.argv[2] 为 'list'
// 以此，要获取实际命令的参数,需要将数组的前两个元素略过
var args = process.argv.splice(2);
var command = args.shift();

var taskStr = args.join(" ");
// process.cwd() 返回进程当前工作目录
var file = path.join(process.cwd(), "/city.json");

const initTasks = (file, cb) => {
    console.log(file);

    fs.exists(file, (exists) => {
        if (exists) {
            fs.readFile(file, "utf8", (err, data) => {
                if (err) throw err;
                var tasks = JSON.parse(data.toString() || "[]");
                console.log(tasks);
                cb(tasks);
            });
        } else {
            cb([]);
        }
    })
}

const listTasks = (file) => {
    initTasks(file, (tasks) => {
        for (var i in tasks) {
            console.dir(tasks[i]);
        }
    })
}

const storeTasks = (file, tasks) => {
    fs.writeFile(file, JSON.stringify(tasks), "utf8", (err) => {
        if (err) throw err;
        console.log("Saved.")
    })
}

const addTask = (file, taskStr) => {
    initTasks(file, (tasks) => {
        if (tasks instanceof Array) {
            tasks.push(taskStr);
        } else {
            tasks["newDate"] = taskStr;
        }

        storeTasks(file, tasks);
    })
}

switch (command) {
    case "list":
        listTasks(file);
        break;
    case "add":
        addTask(file, taskStr);
        break;
    default:
        console.log(`Usage:${process.argv[0]} list|add [taskStr]`);
}