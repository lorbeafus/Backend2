import { ticketsDao } from "../dao/tickets.dao.js";

export class TicketsRepository {
    async getAll() {
        return await ticketsDao.getAll();
    }

    async getById(id) {
        return await ticketsDao.getById(id);
    }

    async getByUser(userId) {
        return await ticketsDao.getByUser(userId);
    }

    async getByEvent(eventId) {
        return await ticketsDao.getByEvent(eventId);
    }

    async findActiveByUserAndEvent(userId, eventId) {
        return await ticketsDao.findActiveByUserAndEvent(userId, eventId);
    }

    async getReservedQuantity(eventId) {
        return await ticketsDao.getReservedQuantityByEvent(eventId);
    }

    async countActiveTickets(eventId) {
        return await ticketsDao.getReservedQuantityByEvent(eventId);
    }

    async create(ticketData) {
        return await ticketsDao.create(ticketData);
    }

    async createTicket(ticketData) {
        return await ticketsDao.create(ticketData);
    }

    async update(id, updateData) {
        return await ticketsDao.update(id, updateData);
    }

    async cancelTicket(id) {
        return await ticketsDao.update(id, {
            status: "cancelled",
            cancelledAt: new Date(),
        });
    }
}

export const ticketsRepository = new TicketsRepository();
