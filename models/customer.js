const mongoose = require("mongoose");
const Joi = require("joi");

const Address = new mongoose.Schema({
    name: {type: String},
    street: {type: String, required: true},
    city: {type: String, required: true},
    province: {type: String, required: true},
    country: {type: String, required: true, default: "Pakistan"},
    postalCode: {type: String},
});

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 50,
    },
    phone: {
        type: String,
        minLength: 10,
        maxLength: 13,
        required: true
    },
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
    },
    addresses: [Address],
    deliveryAddress: Address,
    billingAddress: Address
}));

function validateCustomer(customer) {
    const addressSchema = Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        province: Joi.string().required(),
        country: Joi.string(),
        postalCode: Joi.number(),
    })

    const schema = Joi.object({
        name: Joi.string().required().min(3),
        phone: Joi.string().required().min(10).max(13),
        email: Joi.string().email(),
        addresses: Joi.array().items(addressSchema),
        deliveryAddress: addressSchema,
        billingAddress: addressSchema,
    })

    return schema.validate(customer)
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
module.exports.addressSchema = Address;