import { eventsDao } from "../dao/events.dao.js";

export class EventsRepository {
    async getAll() {
        return await eventsDao.getAll();
    }

    async getById(id) {
        return await eventsDao.getById(id);
    }

    async create(data) {
        return await eventsDao.create(data);
    }
}

export const eventsRepository = new EventsRepository();
