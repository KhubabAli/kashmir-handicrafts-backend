const request = require("supertest");
const {Category} = require("../../models/category");
const {User} = require("../../models/user");

let server;

describe('auth middleware', function () {

    let token;
    beforeEach(() => {
        server = require("../../index");
        token = new User().generateAuthToken();
    });

    afterEach(async () => {
        await server.close();
        await Category.remove({});
    });

    const exec = () => {
        return request(server)
            .post("/api/categories")
            .set("x-auth-token", token)
            .send({name: "category1"});
    }

    it('should return 401 if no token is provided', async function () {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);

    });

    it('should return 401 if no token is provided', async function () {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);

    });
    it('should return 40 if invalid token is provided', async function () {
        token = 'a';

        const res = await exec();

        expect(res.status).toBe(400);

    });
    it('should should return 200 valid tokenis provided', async function () {

        const res = await exec();

        expect(res.status).toBe(200);

    });

});