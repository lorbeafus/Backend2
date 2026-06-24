import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

describe("GET /api/health", () => {
    it("should return 200 OK and status active", async () => {
        const res = await request(app).get("/api/health");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("status", "active");
    });
});
