const Joi = require("joi");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const {Order} = require("../models/order");
const {Item} = require("../models/item");
const mongoose = require("mongoose");


const validateCancellRequest = (req) => {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        orderId: Joi.objectId().required(),
    })
    return schema.validate(req)
}


router.post("/", [auth, validate(validateCancellRequest)], async (req, res) => {

    const order = await Order.lookup(req.body.customerId, req.body.orderId);

    if (!order) return res.status(404).send("Order with the given Id not found");

    if (order.completionDate) return res.status(400).send("Order already completed");

    await Item.updateStock(order.items);

    order.cancel();
    order.save();

    return res.send(order);

});


module.exports = router;