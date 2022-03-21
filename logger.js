const EventEmitter = require('events');


class Logger extends EventEmitter {
    log(message) {
        console.log("message");
        this.emit("loggingMessage", {id: 1, url: "www.www.www"})
    }
}

module.exports = Logger;