const express = require('express');


const Joi = require("joi");
const router = express.Router();

const {Image} = require("../models/image")


router.get("/:id", async (req, res) => {

    const image = await Image.findById(req.params.id);

    if (!image) return res.status(404).send("Item doesn't exist.");

    res.send(image);
})

module.exports = router;