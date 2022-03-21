// POST /api/cancelledOrders {customerId, orderId}

// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieid is not provided
// Return 401 if no order is found for this orderId
// Return 400 if order already completed
// return 200 if this is a valid request
// Set the cancel date
// Increase the stock
// Return the order

const {Order} = require("../../models/order");
const {addressSchema} = require("../../models/customer");
const mongoose = require("mongoose");
const request = require("supertest");
const {User} = require("../../models/user");
const {Item} = require("../../models/item");
const {Category} = require("../../models/category");

describe("/api/cancelledOrders", () => {
    let server;
    let customerId;
    let itemId;
    let order;
    let token;
    let orderId;
    let items;

    const exec = () => {
        return request(server)
            .post("/api/cancelledOrders")
            .set("x-auth-token", token)
            .send({customerId, orderId})
    }
    beforeEach(async () => {
        server = require("../../index");

        customerId = mongoose.Types.ObjectId();
        itemId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        items = [
            new Item({
                name: "12345",
                price: 1,
                category: new Category({
                    name: "category1"
                }),
                numberInStock: 10,
            }),
            new Item({
                name: "67890",
                price: 1,
                category: {name: "category2"},
                numberInStock: 20
            }),
        ]

        for (const item of items) {
            await item.save();
        }


        order = new Order({
            customer: {
                _id: customerId,
                name: "12345",
                phone: "12345"
            },
            deliveryAddress: {
                street: "12345",
                city: "12345",
                province: "12345",
                country: "12345"
            },
            items: items.map((item) => {
                return {...item._doc, count: 1, size: 'a', color: '123'}
            })
        });

        await order.save();
        orderId = order._id;
    });

    afterEach(async () => {
        await Order.remove({});
        await server.close();
    });

    it('should work!', async function () {
        const result = await Order.findById(order._id);
        expect(result).not.toBeNull();
    });

    it('should return 401 if client is not logged in!', async function () {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customer id is not provided', async function () {
        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 400 if order id is not provided', async function () {
        orderId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });
    it('should return 404 if no order found for the order Id', async function () {

        await Order.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });
    it('should return 400 if order already completed', async function () {

        order.completionDate = Date.now();
        await order.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if valid request', async function () {
        const res = await exec();

        expect(res.status).toBe(200);
    });
    it('should set the completion date if valid request', async function () {
        const res = await exec();

        const orderInDb = await Order.findById(orderId);
        const diff = new Date() - orderInDb.completionDate;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should set order status to cancelled if valid request', async function () {
        const res = await exec();

        const orderInDb = await Order.findById(orderId);
        expect(orderInDb.orderStatus).toBe("cancelled");
    });

    it('should increment items in database if valid request', async function () {
        const res = await exec();

        const ids = items.map(item => item._id)


        const itemsInDb = await Item.find({
            _id: {
                $in: ids
            }
        });

        itemsInDb.forEach((item) => {
            const result = items.some((i) => {
                return (i._id.toString() === item._id.toString())
                    && item.numberInStock === i.numberInStock + 1
            })
            expect(result).toBeTruthy();
        })
    });

    it('should return the order if valid request', async function () {
        const res = await exec();

        const orderInDb = await Order.findById(orderId);
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['orderStatus', 'completionDate'])
        )
    });

})