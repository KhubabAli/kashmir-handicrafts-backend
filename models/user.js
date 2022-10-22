const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 255,
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 1024,
    },
    email: {
        type: String,
        min: 5,
        max: 255,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    cartId: {
        type: String
    }
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin,
        phone: this.phone,
        name: this.name,
        cartId: this.cartId,
    }, config.get('jwtPrivateKey'))
}


const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().required().max(50).min(5),
        email: Joi.string().min(5).max(255).email(),
        phone: Joi.string().required().max(50).min(5),
        password: Joi.string().required().min(5).max(255),
    })

    return schema.validate(user)
}

module.exports.validate = validateUser;
module.exports.User = User;