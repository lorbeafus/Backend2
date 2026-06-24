import { eventsService } from "../services/events.services.js";

export async function getAll(req, res, next) {
    try {
        const events = await eventsService.getEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}
