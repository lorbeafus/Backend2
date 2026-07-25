import { eventsRepository } from "../repositories/events.repository.js";

export class EventsService {
    async getEvents() {
        return await eventsRepository.getAll();
    }

    async getEventById(id) {
        return await eventsRepository.getById(id);
    }

    async createEvent(eventData) {
        return await eventsRepository.create(eventData);
    }

    async updateEvent(id, updateData) {
        return await eventsRepository.update(id, updateData);
    }
}

export const eventsService = new EventsService();
