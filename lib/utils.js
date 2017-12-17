"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fs_1 = require("fs");
var tmp_1 = require("tmp");
exports.exec = function (command, options) {
    return new Promise(function (resolve, reject) {
        var args = command.split(' ');
        var instance = child_process_1.spawn(args[0], args.slice(1), options);
        var stdout = '';
        var stderr = '';
        instance.stdout.on('data', function (data) {
            var dataStr = data.toString();
            console.log('stdout:', dataStr);
            stdout += dataStr;
        });
        instance.stderr.on('data', function (data) {
            var dataStr = data.toString();
            console.log('stderr:', dataStr);
            stderr += dataStr;
        });
        instance.on('close', function (code) {
            if (code !== 0) {
                reject(new Error("Child process exited with code " + code + " and stderr output: " + stderr));
                return;
            }
            console.log('child process exited with code:', code);
            resolve({ stdout: stdout, stderr: stderr });
        });
    });
};
exports.readFile = function (path) {
    return new Promise(function (resolve, reject) {
        return fs_1.readFile(path, function (err, data) { return (err ? reject(err) : resolve(data)); });
    });
};
exports.writeFile = function (path, data) {
    return new Promise(function (resolve, reject) {
        return fs_1.writeFile(path, data, function (err) { return (err ? reject(err) : resolve()); });
    });
};
exports.createTempDirectory = function () {
    return new Promise(function (resolve, reject) {
        return tmp_1.dir(function (err, path) { return (err ? reject(err) : resolve(path)); });
    });
};
//# sourceMappingURL=utils.js.map