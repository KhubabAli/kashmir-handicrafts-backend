const mongoose = require("mongoose");
module.exports = function (req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send("Invalid Id is passed");
    next();
}