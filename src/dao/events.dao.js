import { eventModel } from "../models/event.model.js";

export class EventsDAO {
    async getAll() {
        return await eventModel.find();
    }

    async getById(id) {
        return await eventModel.findById(id);
    }

    async create(data) {
        return await eventModel.create(data);
    }
}

export const eventsDao = new EventsDAO();
