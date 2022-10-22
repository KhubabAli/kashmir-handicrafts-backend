const express = require('express');
const multer = require("multer");

const {Item, validate} = require("../models/item")
const {Image} = require("../models/image")
const {Category} = require("../models/category")
const validateMiddleware = require("../middleware/validate");
const imageResize = require("../middleware/imageResize");
const Joi = require("joi");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer(
    {storage: storage}
);

const validateItem = (req) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow(""),
        price: Joi.number().required().min(1),
        categoryIdInDb: Joi.objectId().required(),
        categoryId: Joi.string().required(),
        color: Joi.string().required().min(3),
        size: Joi.string().required().min(3),
        numberInStock: Joi.number().required().min(1),
    })
    return schema.validate(req)
}

router.get("/", async (req, res) => {

    const query = {};

    Object.keys(req.query)?.forEach(key => {
        if (req.query[key]) {
            if (key === 'minPrice') {
                query[`price`] = {
                    $gte: req.query.minPrice,
                    $lte: req.query.maxPrice,

                }
            } else if (key === 'selectedCategories') {
                query["category.name"] = {
                    $in: req.query.selectedCategories.split(',')
                }
            } else if (key === 'selectedColors') {
                query["color"] = {
                    $in: req.query.selectedColors.split(',')
                }
            } else if (key === 'selectedSizes') {
                query[key] = {
                    $in: req.query.selectedSizes.split(',')
                }
            }
        }
    })

    console.log("Query is", query);

    console.log("get items is called", (Number(req.query.page) + 1));
    const pagesToSkip = (Number(req.query.page) - 1) * 10;


    const items = await Item
        .find(query)
        .skip(pagesToSkip)
        .limit(10)
        .sort('name');

    
    console.log("items are", items);   
    res.send(items);
})

router.get("/:id", async (req, res) => {

    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).send("Item doesn't exist.");

    res.send(item);
})

router.post("/", [upload.array("images", 5), imageResize, validateMiddleware(validateItem)], async (req, res) => {
    console.log("post item is called");
    const category = await Category.findById(req.body.categoryIdInDb);
    
    if (!category) return res.status(400).send("Invalid")

    const images = new Image({
        images: req.images
    });

    const item = new Item({
        name: req.body.name,
        price: req.body.price,
        category: {
            _id: category._id,
            name: category.name,
        },
        categoryId: req.body.categoryId,
        description: req.body.description,
        imagesId: images._id,
        thumbnail: req.thumbnail,
        thumbnailHigh: req.thumbnailHigh,
        color: req.body.color,
        size: req.body.size,
        numberInStock: req.body.numberInStock,
    });

    await images.save();
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