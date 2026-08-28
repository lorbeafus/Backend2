import { ticketsService } from "../services/tickets.services.js";

export async function createTicket(req, res, next) {
    try {
        const { eid } = req.params;
        const { quantity = 1 } = req.body;

        const ticket = await ticketsService.createTicket(eid, req.user, quantity);

        res.status(201).json({
            status: "success",
            message: "Inscripción realizada correctamente",
            payload: ticket,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ status: "error", message: error.message });
    }
}

export async function getMyTickets(req, res, next) {
    try {
        const tickets = await ticketsService.getMyTickets(req.user._id);

        res.status(200).json({
            status: "success",
            payload: tickets,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ status: "error", message: error.message });
    }
}

export async function getEventTickets(req, res, next) {
    try {
        const { eid } = req.params;
        const tickets = await ticketsService.getEventTickets(eid, req.user);

        res.status(200).json({
            status: "success",
            payload: tickets,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ status: "error", message: error.message });
    }
}

export async function cancelTicket(req, res, next) {
    try {
        const { tid } = req.params;
        const ticket = await ticketsService.cancelTicket(tid, req.user);

        res.status(200).json({
            status: "success",
            message: "Inscripción cancelada correctamente",
            payload: ticket,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ status: "error", message: error.message });
    }
}
