const Joi = require("joi");


const mongoose = require("mongoose");
const {addressSchema} = require("../models/customer");

const orderSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minLength: 5,
                maxLength: 50
            },
            phone: {
                type: String,
                required: true,
                minLength: 5,
                maxLength: 50
            },
        }),
        required: true,
    },
    deliveryAddress: {
        type: addressSchema,
        required: true,
    },
    billingAddress: {
        type: addressSchema,
    },
    items: {
        type: [new mongoose.Schema({
            name: {
                type: String,
                required: true,
                trim: true,
                minLength: 5,
                maxLength: 255,
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
    totalItems: {
        type: Number,
        min: 1,
        max: 100
    },
    totalPrice: {
        type: Number,
        min: 0,
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    paymentStatus: {
        type: String,
        required: true,
        default: "pending"
    },
    orderStatus: {
        type: String,
        default: "placed"
    },
    expectedArrivalDate: {
        type: Date,
    },
    completionDate: {
        type: Date,
    }
})

orderSchema.statics.lookup = function (customerId, orderId) {
    return this.findOne({
        _id: orderId,
        "customer._id": customerId,
    });
}

orderSchema.methods.cancel = function () {
    this.completionDate = new Date();
    this.orderStatus = "cancelled";
}


const Order = mongoose.model('Order', orderSchema)

function validateOrder(order) {
    const itemSchema = Joi.object({
        _id: Joi.objectId().required(),
        count: Joi.number().required()
    })

    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        items: Joi.array().items(itemSchema).required()
    });
    return schema.validate(order);
}

module.exports.Order = Order;
module.exports.validate = validateOrder;
