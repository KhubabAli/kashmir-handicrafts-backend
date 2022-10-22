const mongoose = require("mongoose");
const Joi = require("joi");

const {categorySchema} = require("./category")

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 255,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        min: 0,
        max: 50000,
        required: true
    },
    category: {
        type: categorySchema,
        required: true,
    },
    description: String,
    imagesId: {
        type: String,
        required: true
    },
    thumbnail: {
        type: Buffer, required: true
    },
    thumbnailHigh: {
        type: Buffer, required: true
    },
    categoryId: {
        type: String,
        required: true
    },
    color: String,
    size: String,
    totalItems: Number,
    soldOut: Boolean,
    arrivalDate: {type: Date, default: Date.now},
    numberInStock: {type: Number, min: 0, max: 255, required: true},
    soldItems: Number,
})

itemSchema.statics.updateStock = function (items) {
    return Promise.all(
        items.map(item => this.findByIdAndUpdate(item._id, {
            $inc: {numberInStock: item.count}
        }))
    )
}

const Item = mongoose.model('Item', itemSchema);

function validateItem(item) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).required(),
        price: Joi.number().required().min(0).required(),
        categoryId: Joi.objectId().required(),
        description: Joi.number().min(0).max(200),
        images: Joi.array().items(String),
        color: Joi.string().required().min(3).required(),
        size: Joi.string().required().min(3).required(),
        totalItems: Joi.number(),
        numberInStock: Joi.number().required().min(0),
        soldItems: Joi.number(),
        soldOut: Joi.bool(),
        arrivalDate: Joi.date(),
    })

    return schema.validate(item)
}

module.exports.Item = Item;
module.exports.validate = validateItem;