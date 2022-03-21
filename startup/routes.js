const express = require("express");

const home = require("../routes/home");
const items = require("../routes/items");
const customers = require("../routes/customers");
const orders = require("../routes/orders");
const uesrs = require("../routes/users");
const auth = require("../routes/auth");
const categories = require("../routes/categories");
const cancelledOrders = require("../routes/cancelledOrders");
const error = require("../middleware/error");

module.exports = function (app) {
    app.use(express.json());
    app.use("/api/home", home);
    app.use("/api/items", items);
    app.use("/api/categories", categories);
    app.use("/api/customers", customers);
    app.use("/api/orders", orders);
    app.use("/api/users", uesrs);
    app.use("/api/auth", auth);
    app.use("/api/cancelledOrders", cancelledOrders);

    app.use(error)
}