import { ticketsRepository } from "../repositories/tickets.repository.js";

export class TicketsService {
    async getTickets() {
        return await ticketsRepository.getAll();
    }

    async getTicketById(id) {
        return await ticketsRepository.getById(id);
    }

    async createTicket(data) {
        return await ticketsRepository.create(data);
    }
}

export const ticketsService = new TicketsService();
