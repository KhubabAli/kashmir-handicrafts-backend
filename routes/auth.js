const express = require('express');
const mongoose = require("mongoose");
const Joi = require("joi")
const jwt = require("jsonwebtoken");
const _ = require("lodash")
const bcrypt = require("bcrypt");
const config = require("config");

const {User} = require("../models/user");

const router = express.Router();


router.post("/", async (req, res) => {

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    let user = await User.findOne({phone: req.body.phone});
    if (!user) return res.status(400).send("Invalid username or password.");


    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid Username or password.");

    const token = user.generateAuthToken();

    res.send(token);
})


router.post("/signUp", async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({phone: req.body.phone});
    if(user) return res.status(400).send("This phone number is already associated with another user");

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);

    

    user = new User({
        name: req.body.name,
        phone: req.body.phone,
        password: hash,
        email: req.body.email,
    })

})

function validate(req) {
    const schema = Joi.object({
        phone: Joi.string().required().max(50).min(5),
        password: Joi.string().required().min(5).max(255),
    })

    return schema.validate(req)
}


module.exports = router;