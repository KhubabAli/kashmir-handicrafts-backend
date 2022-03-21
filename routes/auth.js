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
    if (!user) return res.status(400).send("User not registered.");


    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("User not registered.");

    const token = user.generateAuthToken();

    res.send(token);
})


function validate(req) {
    const schema = Joi.object({
        phone: Joi.string().required().max(50).min(5),
        password: Joi.string().required().min(5).max(255),
    })

    return schema.validate(req)
}


module.exports = router;