import { ticketsService } from "../services/tickets.services.js";

export async function getAllTickets(req, res, next) {
    try {
        const tickets = await ticketsService.getTickets();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}
