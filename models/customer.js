const mongoose = require("mongoose");
const Joi = require("joi");

const Address = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    streetAddress: {type: String, required: true},
    city: {type: String, required: true},
    addressLine2: Joi.string().min(0),
    state: {type: String, required: true},
    phone: Joi.string().required().min(10).max(13),
    country: {type: String, required: true, default: "Pakistan"},
    postalCode: {type: String},
});

const Customer = mongoose.model('Customer', new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 3,
        maxLength: 50,
    },
    lastName: {
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
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        streetAddress: Joi.string().required(),
        addressLine2: Joi.string().min(0),
        city: Joi.string().required(),
        phone: Joi.string().required().min(10).max(13),
        state: Joi.string().required(),
        id: Joi.number().required(),
        country: Joi.string().required(),
        postalCode: Joi.string().required(),
    })

    const schema = Joi.object({
        firstName: Joi.string().required().min(3),
        lastName: Joi.string().required().min(3),
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