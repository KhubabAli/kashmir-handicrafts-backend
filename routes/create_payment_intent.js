const express = require('express');
const Stripe = require("stripe");
const Joi = require("joi")
const _ = require("lodash")
const bcrypt = require("bcrypt");
const config = require("config");


const stripe = Stripe(config.get("stripeSecretKey"));

const {User} = require("../models/user");
const {Order} = require("../models/order");

const router = express.Router();


router.post("/", async (req, res) => {
    console.log("Create_payment_intent is called")
    const orderId = req.body.orderId;
    console.log("Order id is: " + orderId);
    let totalPrice = 0;
    const deliveryFee = 250;

    const order = await Order.findById(orderId);
    if (!order) return res.send("Failed to find the order, try again").status(404);
    order.items.forEach(item => totalPrice += item.price * item.count);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: (totalPrice + deliveryFee) * 100,
        currency: "pkr",
        payment_method_types: ['card']
    })

    console.log("payment Intent.clinet secret" + {clientSecret: paymentIntent.client_secret})
    res.send({clientSecret: paymentIntent.client_secret});
})


module.exports = router;