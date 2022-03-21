const request = require("supertest");
const {Category} = require("../../models/category");
const {User} = require("../../models/user");

let server;

describe('/api/categories', () => {

    beforeEach(() => {
        server = require("../../index");

    });

    afterEach(async () => {
        await server.close();
        await Category.remove({});
    })

    describe("GET /", () => {
        it("should return all categories", async () => {
            await Category.insertMany([
                {name: "category1"},
                {name: "category2"},
            ])


            const res = await request(server).get("/api/categories");
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'category1')).toBeTruthy();
        })
    })
    describe("GET /:id", () => {
        it('should return a genre if a valid id is passed', async function () {
            const category = new Category({name: "category1"});
            await category.save();

            const res = await request(server).get("/api/categories/" + category._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'category1');
        })

        it('should return 404 if invalid id is passed', async function () {
            const res = await request(server).get("/api/categories/1234");
            expect(res.status).toBe(404);
        });
    })
    describe("POST /", () => {

        let token;
        let name;

        function exec() {
            return request(server)
                .post("/api/categories")
                .set("x-auth-token", token)
                .send({name});
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = "category1";
        })

        it('should return 401 if client is not logged in', async function () {
            token = "";

            const res = await exec();

            expect(res.status).toBe(401);
        });
        it('should return 400 if category is less than 5 characters', async function () {
            name = "12"

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should return 400 if category is more than 50 characters', async function () {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should save category if it is valid', async function () {
            const res = await exec();

            const category = await Category.find({name});

            expect(category).not.toBeNull();
            expect(res.status).toBe(200);
        });
        it('should return category if it is valid', async function () {

            const res = await exec();

            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", "category1");
        });
    })
})