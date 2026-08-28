import { eventModel } from "../models/event.model.js";

export class EventsDAO {
    async getAll() {
        return await eventModel.find().populate("category").populate("organizer", "first_name last_name email");
    }

    async getByFilters(filters = {}, options = {}) {
        const { sort = "date", skip = 0, limit = 10 } = options;
        return await eventModel
            .find(filters)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate("category")
            .populate("organizer", "first_name last_name email");
    }

    async count(filters = {}) {
        return await eventModel.countDocuments(filters);
    }

    async getById(id) {
        return await eventModel.findById(id).populate("category").populate("organizer", "first_name last_name email");
    }

    async create(eventData) {
        return await eventModel.create(eventData);
    }

    async update(id, updateData) {
        return await eventModel.findByIdAndUpdate(id, updateData, { new: true, returnDocument: "after" });
    }
}

export const eventsDao = new EventsDAO();

