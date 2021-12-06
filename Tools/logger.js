const chalk = require("chalk");
const moment = require("moment");

exports.log = (content, type = "log") => {
    const timestamp = `[${moment().format("DD-MM-YY H:m:s")}]`;
    switch (type) {
        case "log": {
            return console.log(`${timestamp} ${chalk.blue(type.toUpperCase())} ${content} `);
        }
        case 'warn': {
            return console.log(`${timestamp} ${chalk.yellow(type.toUpperCase())} ${content} `);
        }
        case 'error': {
            return console.log(`${timestamp} ${chalk.red(type.toUpperCase())} ${content} `);
        }
        case 'cmd': {
            return console.log(`${timestamp} ${chalk.gray(type.toUpperCase())} ${content}`);
        }
        case 'ready': {
            return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content}`);
        }

        case 'success': {
            return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content}`);
        }

        case 'load': {
            return console.log(`${timestamp} ${chalk.magenta(type.toUpperCase())} ${content} `);
        }
        case 'event': {
            return console.log(`${timestamp} ${chalk.cyan(type.toUpperCase())} ${content} `);
        }
        default: throw new TypeError(`Invalid Type of Log: ${type}`);
    }
};

// Use when an error occurs
exports.error = (...args) => this.log(...args, 'error');

exports.warn = (...args) => this.log(...args, 'warn');

// Use when a command is called
exports.cmd = (...args) => this.log(...args, 'cmd');

// Use when something is ready
exports.ready = (...args) => this.log(...args, 'ready');

// Use when something succeeded
exports.ready = (...args) => this.log(...args, 'success');

// Use when something loaded
exports.load = (...args) => this.log(...args, 'load');

// Use when an event is triggered
exports.event = (...args) => this.log(...args, 'event');