"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log4Others = exports.log4Notice = exports.log4Error = exports.log4Info = exports.LoggerBlogs = exports.LoggerCredit = exports.LoggerErr = exports.Logger = void 0;
const chalk = require("chalk");
const log4js = require("log4js");
const userInfo_1 = require("./userInfo");
const log = console.log;
log4js.configure({
    appenders: {
        Notice: { type: 'file', filename: 'logs/notice.log', compress: true },
        Credit: { type: 'file', filename: 'logs/credit.log', compress: true },
        Blogs: { type: 'file', filename: 'logs/blogs.log', compress: true },
        Error: { type: 'file', filename: 'logs/error.log', compress: true },
    },
    categories: {
        default: { appenders: ['Notice'], level: 'debug' },
        Blogs: { appenders: ['Blogs'], level: 'info' },
        Error: { appenders: ['Error'], level: 'error' },
        Credit: { appenders: ['Credit'], level: 'info' },
    },
});
exports.Logger = log4js.getLogger('Notice');
exports.LoggerErr = log4js.getLogger('Error');
exports.LoggerCredit = log4js.getLogger('Credit');
exports.LoggerBlogs = log4js.getLogger('Blogs');
exports.log4Info = (info) => {
    userInfo_1.INFO.Logger && log(chalk.green(info));
};
exports.log4Error = (err) => {
    log(chalk.red(err));
};
exports.log4Notice = (note) => {
    userInfo_1.INFO.Logger && log(chalk.yellow(note));
};
exports.log4Others = (other) => {
    userInfo_1.INFO.Logger && log(chalk.blue(other));
};
