import { jest, describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";
import { eventsService } from "../src/services/events.services.js";

// Mock the eventsService method to avoid DB queries during testing
jest.spyOn(eventsService, "getEvents").mockResolvedValue([
    { _id: "1", name: "Concierto Test", price: 100 }
]);

describe("GET /api/events", () => {
    it("should return a mock list of events and status 200", async () => {
        const res = await request(app).get("/api/events");
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty("name", "Concierto Test");
    });
});
