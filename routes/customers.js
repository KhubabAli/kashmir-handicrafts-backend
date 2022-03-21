const express = require('express');
const mongoose = require("mongoose");

const {Customer, validate} = require("../models/customer")

const router = express.Router();


router.get("/", async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
})

router.get("/:id", (req, res) => {
    const customer = Customer.findById(req.params.id);

    if (!customer) return res.status(404).send("Customer doesn't exist.");

    res.send(customer);
})

router.post("/", async (req, res) => {

    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const customer = new Customer(req.body);
    await customer.save();

    res.send(customer);
})


router.put("/:id", async (req, res) => {

    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        $set: req.body,
    }, {new: true})

    if (!customer) return res.status(404).send("Customer doesn't exist.");

    res.send(customer);
})


router.delete("/:id", async (req, res) => {

    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send("Customer doesn't exist.");

    res.send(customer)
})

module.exports = router;