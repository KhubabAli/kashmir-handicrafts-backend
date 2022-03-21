const config = require("config");
module.exports = function () {

    if (!config.get("jwtPrivateKey")) {
        throw Error("FATAL ERROR: jwtPrivateKey is not defined.");
    }
}
