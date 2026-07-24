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

    async update(id, data) {
        return await eventModel.findByIdAndUpdate(id, data, { new: true });
    }
}

export const eventsDao = new EventsDAO();
