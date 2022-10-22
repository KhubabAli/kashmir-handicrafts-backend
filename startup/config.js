const config = require("config");
module.exports = function () {


    console.log("SecretKey", config.get("stripeSecretKey"));
    console.log("Public Key", config.get("stripePublicKey"));

    if (!config.get("jwtPrivateKey")) {
        throw Error("FATAL ERROR: jwtPrivateKey is not defined.");
    }
}
