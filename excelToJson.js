var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require("path");
var exec = require('child_process').exec;

let outPath = './data';
let filePath = './files';

var list = [];
var pathList = [];

process.on('error', function (err) {
    console.log(err)
});

let base = path.resolve('./files').split('\\').length;

let fileType = 'xlsx';


function writeFile(fileName, data) {
    fs.writeFile(fileName, data, 'utf-8', complete);

    function complete(err) {
        if (!err) {
            console.log(fileName + "文件写入成功");
        }
    }
}


// getAllPath('./files');
//
//
// for (let i = 0; i < list.length; i++) {
//     pathList[i] = list[i].split('\\').slice(base);
// }
//
function dealData(arr) {
    let obj = {};
    let tittle = arr[0];
    let type = arr[1];
    let rowNum = arr.length - 2;
    for (let i = 0; i < rowNum; i++) {
        obj[i] = {};
        for (let j = 0; j < tittle.length; j++) {
            let key = tittle[j];
            let info = arr[2 + i][j];
            if (type[j] == 'int') {
                info = parseInt(info);
            } else if (type[j] == 'string') {
                info = info.toString();
            } else {

            }
            obj[i][key] = info
        }
    }
    return obj;
}

//
//
// if (!fs.existsSync(outPath)) {
//     fs.mkdir(outPath, (err) => {
//         if (!err) {
//             console.log("生成成功");
//         }
//     });
// } else {
//
// }
// for (let i = 0; i < pathList.length; i++) {
//     mk(pathList[i], outPath, 0)
// }
//
// console.log(pathList);
//
function mk(arr, path1, index) {
    if (index >= arr.length) return;
    let _path = path.join(path1, arr[index]);
    let type = arr[index].slice(arr[index].length - fileType.length);
    if (fs.existsSync(_path)) {
        if ((type == fileType)) {
            fs.writeFile(_path.slice(0, _path.length - fileType.length) + 'json', '', function (err) {
                if (!err)
                    console.log(_path.slice(0, _path.length - fileType.length) + 'json' + '创建成功');
            })
        } else {
            index++;
            mk(arr, _path, index)
        }
    } else {
        if (type == fileType) {
            fs.writeFile(_path.slice(0, _path.length - fileType.length) + 'json', '', function (err) {
                if (!err)
                    console.log(_path.slice(0, _path.length - fileType.length) + 'json' + '创建成功');
            })
        } else {
            fs.mkdir(_path, function (err) {
                if (!err) {
                    console.log(_path + '文件夹创建成功');
                    index++;
                    mk(arr, _path, index)
                }
            })
        }
    }
}

// setTimeout(() => {
//     console.log("9999");
//     for (let i = 0; i < list.length; i++) {
//         let newPath = outPath;
//         // let last = pathList[i][pathList[i].length - 1];
//         // let name = last.slice(0, last.length - fileType.length) + 'json';
//         let xlsxData = xlsx.parse(list[i]);
//         let string = dealData(xlsxData[0].data);
//         for (let j = 0; j < pathList[i].length; j++) {
//             newPath = path.join(newPath, pathList[i][j]);
//         }
//         if (newPath.slice(newPath.length - fileType.length) == fileType) {
//             newPath = newPath.slice(0, newPath.length - fileType.length) + 'json';
//         }
//         writeFile(newPath, JSON.stringify(string));
//     }
// }, 2);

// function delFile(fileUrl, flag) {
//     if (!fs.existsSync(fileUrl)) return;
//     // 当前文件为文件夹时
//     if (fs.statSync(fileUrl).isDirectory()) {
//         var files = fs.readdirSync(fileUrl);
//         var len = files.length,
//             removeNumber = 0;
//         if (len > 0) {
//             files.forEach(function (file) {
//                 removeNumber++;
//                 var url = fileUrl + '/' + file;
//                 if (fs.statSync(url).isDirectory()) {
//                     delFile(url, true);
//                 } else {
//                     fs.unlinkSync(url);
//                 }
//             });
//             if (len == removeNumber && flag) {
//                 fs.rmdirSync(fileUrl);
//             }
//         } else if (len == 0 && flag) {
//             fs.rmdirSync(fileUrl);
//         }
//     } else {
//         // 当前文件为文件时
//         fs.unlinkSync(fileUrl);
//         console.log('删除文件' + fileUrl + '成功');
//     }
// }

function dealDir(cb) {
    let path1 = path.join(__dirname, './files');
    let cmd = path.join(__dirname, './cmd/1.cmd');
    let path2 = path.join(__dirname, './data');
    exec(`start ${cmd} ${path1} ${path2}`, (error) => {
        if (error) {
            console.error(`执行的错误: ${error}`);
            return;
        }
        console.log("执行完成");
        cb && cb();
    });
}

function getAllPath(name) {
    let files = fs.readdirSync(name);
    for (let i = 0; i < files.length; i++) {
        let fPath = path.resolve(name, files[i]);
        let stats = fs.statSync(fPath);
        if (stats.isDirectory()) getAllPath(fPath);
        if (stats.isFile()) list.push(fPath);
    }
}

function getExcelData() {
    for (let i = 0; i < list.length; i++) {
        pathList[i] = list[i].split('\\').slice(base);
    }

    // for (let i = 0; i < pathList.length; i++) {
    //     mk(pathList[i], outPath, 0)
    // }
    for (let i = 0; i < list.length; i++) {
        let newPath = outPath;
        let xlsxData = xlsx.parse(list[i]);
        let string = dealData(xlsxData[0].data);
        for (let j = 0; j < pathList[i].length; j++) {
            newPath = path.join(newPath, pathList[i][j]);
        }
        if (newPath.slice(newPath.length - fileType.length) == fileType) {
            newPath = newPath.slice(0, newPath.length - fileType.length) + 'json';
        }
        writeFile(newPath, JSON.stringify(string));

    }
}

function start() {
    getAllPath(filePath);
    getExcelData();
}

function excelToJson() {
    dealDir(start);
}


excelToJson();
