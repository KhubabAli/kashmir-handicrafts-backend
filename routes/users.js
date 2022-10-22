const express = require('express');
const mongoose = require("mongoose");
const _ = require("lodash")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const {User, validate} = require("../models/user");
const {Cart} = require("../models/cart");
const auth = require("../middleware/auth");


const router = express.Router();


router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
})

router.get("/:id", (req, res) => {
    const category = Category.findById(req.params.id);

    if (!category) return res.status(404).send("Category doesn't exist.");

    res.send(category);
})

router.post("/", async (req, res) => {

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    let user = await User.findOne({phone: req.body.phone});
    if (user) return res.status(400).send("User already exists");

    const cart = new Cart({items: []});

    user = new User(
        {
            ..._.pick(req.body, ["name", "phone", "email", "password"]),
            cartId: cart._id
        })

    cart.customerId = user._id;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await cart.save();
    await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user, ["name", "email", "phone", "_id", "cartId"]));

})


router.put("/:id", async (req, res) => {

    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const category = await Category.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name
        },
    }, {new: true})

    if (!category) return res.status(404).send("Category doesn't exist.");

    res.send(category);
})

router.delete("/:id", async (req, res) => {

    const category = await Category.findByIdAndRemove(req.params.id);
    if (!category) return res.status(404).send("Category doesn't exist.");

    res.send(category)
})

module.exports = router;