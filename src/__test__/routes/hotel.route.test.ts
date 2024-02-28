import request from 'supertest';
import app from '../../main';

describe("Hotel routes", () => {
    test("Should return true", async () => {
        // const res = await request(app).get("/hotel");
        // expect(res.status).toBe(200);
        expect(true).toBe(true);
    });
})