const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");

const imageSchema = new mongoose.Schema({
    images: {
        type: Array(Buffer),
        required: true,
    },
});


const Image = mongoose.model('Image', imageSchema);

module.exports.Image = Image;