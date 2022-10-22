const Joi = require("joi");


const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    customerId: {type: String, required: true},
    items: {
        type: [new mongoose.Schema({
            name: {
                type: String,
                required: true,
                trim: true,
                minLength: 5,
                maxLength: 255,
            },
            thumbnailHigh: {
                type: Buffer,
                required: true,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
                max: 10000
            },
            count: {
                type: Number,
                required: true,
                min: 0,
                max: 50,
            },
            color: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 50,
            },
            size: {
                type: String,
                required: true,
                minLength: 1,
                maxLength: 50
            }
        })],
        required: true,
    },

})


const Cart = mongoose.model('Cart', cartSchema)

function validateItem(item) {
    const itemSchema = Joi.object({
        _id: Joi.objectId().required(),
        count: Joi.number().required()
    })
    return itemSchema.validate(item);
}

function validateCart(cart) {
    const itemSchema = Joi.object({
        _id: Joi.objectId().required("Item Id is required"),
        count: Joi.number().required()
    })

    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        items: Joi.array().items(itemSchema).required()
    });
    return schema.validate(cart);
}

module.exports.Cart = Cart;
module.exports.validate = validateCart;
module.exports.validateItem = validateItem;

