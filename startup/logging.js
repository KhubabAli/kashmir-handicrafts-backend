const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
const config = require("config");


module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.File({filename: 'uncaughtExceptions.log'}),
        new winston.transports.Console({colorize: true, prettyPrint: true})
    )
    winston.add(new winston.transports.File({filename: 'error.log'}));
    winston.add(new winston.transports.Console({colorize: true, prettyPrint: true}));
    winston.add(new winston.transports.MongoDB({db: config.get("db")}));

    process.on('uncaughtException', (error) => {
        console.log("AN UNCAUGHT EXCEPTION IS CAUGHT");
        winston.error(error.message, error);
    })
}