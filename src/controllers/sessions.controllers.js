import { sessionsService } from "../services/sessions.services.js";

export async function getSession(req, res, next) {
    try {
        const session = await sessionsService.getCurrentSession();
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}
