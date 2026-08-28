import { ticketsService } from "../services/tickets.services.js";
import { TicketResponseDTO } from "../dto/index.js";

export async function createTicket(req, res, next) {
    try {
        const { eid } = req.params;
        const { quantity = 1 } = req.body;

        const ticket = await ticketsService.createTicket(eid, req.user, quantity);

        res.status(201).json({
            status: "success",
            message: "Inscripción realizada correctamente",
            payload: TicketResponseDTO.getFrom(ticket),
        });
    } catch (error) {
        next(error);
    }
}

export async function getMyTickets(req, res, next) {
    try {
        const tickets = await ticketsService.getMyTickets(req.user._id);

        res.status(200).json({
            status: "success",
            payload: TicketResponseDTO.getFrom(tickets),
        });
    } catch (error) {
        next(error);
    }
}

export async function getEventTickets(req, res, next) {
    try {
        const { eid } = req.params;
        const tickets = await ticketsService.getEventTickets(eid, req.user);

        res.status(200).json({
            status: "success",
            payload: TicketResponseDTO.getFrom(tickets),
        });
    } catch (error) {
        next(error);
    }
}

export async function cancelTicket(req, res, next) {
    try {
        const { tid } = req.params;
        const ticket = await ticketsService.cancelTicket(tid, req.user);

        res.status(200).json({
            status: "success",
            message: "Inscripción cancelada correctamente",
            payload: TicketResponseDTO.getFrom(ticket),
        });
    } catch (error) {
        next(error);
    }
}
