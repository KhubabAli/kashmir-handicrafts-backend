const {validate, Order} = require("../models/order");
const {Item} = require("../models/item");
const {Customer} = require("../models/customer");

const Fawn = require("fawn");
const mongoose = require("mongoose");
const express = require("express");

Fawn.init("mongodb://localhost/kashmir-handicraft");
const router = express.Router();


router.get("/", async (req, res) => {
    const orders = await Order.find().sort('-orderDate');
    res.send(orders);
})

router.post("/", async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid Customer.");

    const ids = []
    req.body.items.forEach(item => {
        ids.push(item._id)
    })
    const items = await Item.find({
        _id: {
            $in: ids
        }
    }).select('name price count color size numberInStock')

    if (items.length === 0 || !items) return res.status(400).send("Invalid items");

    const orderItems = [];

    items.forEach(orderItem => {
            // let count = req.body.items.filter(item => item._id === orderItem._id).count;
            let count = req.body.items.filter(item => item._id.toString() === orderItem._id.toString())[0].count;

            console.log(orderItem.numberInStock);
            if (count > orderItem.numberInStock) {
                count = orderItem.numberInStock;
            }
            orderItems.push({
                _id: orderItem._id,
                name: orderItem.name,
                price: orderItem.price,
                color: orderItem.color,
                size: orderItem.size,
                count: count,
            })
        }
    )


    let totalPrice = 0;
    totalPrice += orderItems.map(item => {
        return (item.price) * item.count;
    })

    const order = Order({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        items: orderItems,
        deliveryAddress: customer.deliveryAddress,
        billingAddress: customer.billingAddress,
        totalPrice: totalPrice
    })

    try {
        let task = Fawn.Task();
        task = task.save('orders', order)

        orderItems.forEach(item => {
            task = task.update('items', {_id: item._id}, {
                $inc: {
                    numberInStock: -item.count
                }
            })
        })
        task.run();
        res.send(order)

    } catch (error) {
        console.log(error)
        res.status(500).send("Something went wrong.");
    }
})

module.exports = router
