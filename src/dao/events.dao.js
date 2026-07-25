import { eventModel } from "../models/event.model.js";

export class EventsDAO {
    async getAll() {
        return await eventModel.find();
    }

    async getById(id) {
        return await eventModel.findById(id);
    }

    async create(eventData) {
        return await eventModel.create(eventData);
    }

    async update(id, updateData) {
        return await eventModel.findByIdAndUpdate(id, updateData, { new: true });
    }
}

export const eventsDao = new EventsDAO();
