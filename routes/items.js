const express = require('express');
const mongoose = require("mongoose");

const {Item, validate} = require("../models/item")
const {Category} = require("../models/category")
const validateMiddleware = require("../middleware/validate");
const router = express.Router();


router.get("/", async (req, res) => {
    const items = await Item.find().sort('name');
    res.send(items);
})

router.get("/:id", (req, res) => {
    const item = Item.findById(req.params.id);

    if (!item) return res.status(404).send("Item doesn't exist.");

    res.send(item);
})

router.post("/", validateMiddleware(validate), async (req, res) => {

    const category = await Category.findById(req.body.categoryId);
    if (!category) return res.status(400).send("Invalid")

    const item = new Item({
        name: req.body.name,
        price: req.body.price,
        category: {
            _id: category._id,
            name: category.name,
        },
        description: req.body.description,
        images: req.body.images,
        color: req.body.color,
        size: req.body.size,
        totalItems: req.body.totalNumber,
        soldOut: req.body.soldOut,
        arrivalDate: req.body.arrivalDate,
        numberInStock: req.body.numberInStock,
        soldItems: req.body.soldItems,
    });

    await item.save();

    res.send(item);
})


router.put("/:id", async (req, res) => {

    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const item = await Item.findByIdAndUpdate(req.params.id, {
        $set: req.body,
    }, {new: true})

    if (!item) return res.status(404).send("Item doesn't exist.");

    res.send(item);
})


router.delete("/:id", async (req, res) => {

    const item = await Item.findByIdAndRemove(req.params.id);
    if (!item) return res.status(404).send("Item doesn't exist.");

    res.send(item)
})

module.exports = router;