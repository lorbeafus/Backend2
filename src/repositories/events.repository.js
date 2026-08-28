import { eventsDao } from "../dao/events.dao.js";

export class EventsRepository {
    async getAll() {
        return await eventsDao.getAll();
    }

    async getEventsByFilters(filters, options) {
        return await eventsDao.getByFilters(filters, options);
    }

    async findPublishedEvents(filters = {}, options = {}) {
        return await eventsDao.getByFilters({ ...filters, status: "published" }, options);
    }

    async countEvents(filters) {
        return await eventsDao.count(filters);
    }

    async getById(id) {
        return await eventsDao.getById(id);
    }

    async getEventById(id) {
        return await eventsDao.getById(id);
    }

    async create(eventData) {
        return await eventsDao.create(eventData);
    }

    async createEvent(eventData) {
        return await eventsDao.create(eventData);
    }

    async update(id, updateData) {
        return await eventsDao.update(id, updateData);
    }

    async updateEvent(id, updateData) {
        return await eventsDao.update(id, updateData);
    }
}

export const eventsRepository = new EventsRepository();
