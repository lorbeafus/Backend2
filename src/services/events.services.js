import { eventsRepository } from "../repositories/events.repository.js";

export class EventsService {
    async getEvents() {
        return await eventsRepository.getAll();
    }

    async getEventById(id) {
        return await eventsRepository.getById(id);
    }

    async createEvent(data) {
        return await eventsRepository.create(data);
    }
}

export const eventsService = new EventsService();
