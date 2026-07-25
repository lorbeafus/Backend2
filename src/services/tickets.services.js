import { ticketsRepository } from "../repositories/tickets.repository.js";

export class TicketsService {
    async getTickets() {
        return await ticketsRepository.getAll();
    }

    async getTicketById(id) {
        return await ticketsRepository.getById(id);
    }

    async createTicket(ticketData) {
        return await ticketsRepository.create(ticketData);
    }
}

export const ticketsService = new TicketsService();
