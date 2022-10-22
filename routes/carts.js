const express = require("express");

const {Cart, validateItem} = require("../models/cart")
const {Item} = require("../models/item");
const validateObjectId = require("../middleware/validateObjectId");
const validate = require("../middleware/validate");
const _ = require("lodash");

const router = express.Router();

router.get("/", async (req, res) => {
    const carts = await Cart.find();
    res.send(carts);
});

router.get("/:id", async (req, res) => {
    const cart = await Cart.findById(req.params.id);

    if (!cart) return res.status(404).send("Cart doesn't exist");

    res.send(cart);
});

router.put("/:id", [validateObjectId, validate(validateItem)], async (req, res) => {
    const cart = await Cart.findById(req.params.id);

    if (!cart) return res.status(400).send("Invalid request.");

    let item = await Item.findById(req.body._id);

    if (!item) return res.status(404).send("Sorry, this item doesn't exist");

    item = {..._.pick(item, ["name", "price", "color", "size", "thumbnailHigh", "_id"]), count: req.body.count};

    cart.items.push(item);

    await cart.save();

    res.send(cart);
})


module.exports = router
