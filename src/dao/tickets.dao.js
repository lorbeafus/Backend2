import { ticketModel } from "../models/ticket.model.js";

export class TicketsDAO {
    async getAll() {
        return await ticketModel.find().populate("user").populate("event");
    }

    async getById(id) {
        return await ticketModel.findById(id).populate("user").populate("event");
    }

    async create(data) {
        return await ticketModel.create(data);
    }
}

export const ticketsDao = new TicketsDAO();
