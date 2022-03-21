const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
});

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(50)
    })

    return schema.validate(category)
}

module.exports.categorySchema = categorySchema;
module.exports.validate = validateCategory;
module.exports.Category = Category;