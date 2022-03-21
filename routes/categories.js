const express = require('express');
const mongoose = require("mongoose");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const {Category, validate} = require("../models/category");


const router = express.Router();


router.get("/", async (req, res, next) => {
    const categories = await Category.find().sort('name');
    res.send(categories);
})

router.get("/:id", validateObjectId, async (req, res) => {


    const category = await Category.findById(req.params.id);

    if (!category) return res.status(404).send("Category doesn't exist.");

    res.send(category);
})

router.post("/", auth, async (req, res) => {

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = new Category({name: req.body.name});
    await category.save();

    res.send(category);
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

router.delete("/:id", [auth, admin], async (req, res) => {

    const category = await Category.findByIdAndRemove(req.params.id);
    if (!category) return res.status(404).send("Category doesn't exist.");

    res.send(category)
})

module.exports = router;