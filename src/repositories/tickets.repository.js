import { ticketsDao } from "../dao/tickets.dao.js";

export class TicketsRepository {
    async getAll() {
        return await ticketsDao.getAll();
    }

    async getById(id) {
        return await ticketsDao.getById(id);
    }

    async create(ticketData) {
        return await ticketsDao.create(ticketData);
    }
}

export const ticketsRepository = new TicketsRepository();
