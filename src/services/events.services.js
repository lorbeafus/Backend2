import { eventsRepository } from "../repositories/events.repository.js";

export class EventsService {
    async getEvents(query = {}) {
        const {
            category,
            status,
            location,
            level,
            organizer,
            fromDate,
            toDate,
            minPrice,
            maxPrice,
            search,
            page = 1,
            limit = 10,
            sort = "date",
        } = query;

        const filter = {};

        if (category) filter.category = category;
        if (status) filter.status = status;
        if (level) filter.level = level;
        if (organizer) filter.organizer = organizer;

        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        const fromDateVal = query.dateFrom || query.fromDate;
        const toDateVal = query.dateTo || query.toDate;

        if (fromDateVal || toDateVal) {
            filter.date = {};
            if (fromDateVal) filter.date.$gte = new Date(fromDateVal);
            if (toDateVal) filter.date.$lte = new Date(toDateVal);
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined && minPrice !== "") filter.price.$gte = Number(minPrice);
            if (maxPrice !== undefined && maxPrice !== "") filter.price.$lte = Number(maxPrice);
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 50);
        const skip = (pageNumber - 1) * limitNumber;

        const events = await eventsRepository.getEventsByFilters(filter, {
            sort,
            skip,
            limit: limitNumber,
        });

        const totalEvents = await eventsRepository.countEvents(filter);
        const totalPages = Math.ceil(totalEvents / limitNumber) || 1;

        return {
            data: events,
            pagination: {
                total: totalEvents,
                page: pageNumber,
                limit: limitNumber,
                totalPages,
            },
        };
    }

    async getEventById(id) {
        const event = await eventsRepository.getById(id);
        if (!event) {
            const error = new Error("Evento no encontrado");
            error.statusCode = 404;
            throw error;
        }
        return event;
    }

    async createEvent(eventData) {
        const eventDate = new Date(eventData.date);
        const now = new Date();

        if (eventDate <= now) {
            const error = new Error("La fecha del evento debe ser futura");
            error.statusCode = 400;
            throw error;
        }

        if (eventData.capacity <= 0) {
            const error = new Error("La capacidad debe ser mayor a cero");
            error.statusCode = 400;
            throw error;
        }

        if (eventData.price < 0) {
            const error = new Error("El precio no puede ser negativo");
            error.statusCode = 400;
            throw error;
        }

        return await eventsRepository.create({
            ...eventData,
            date: eventDate,
        });
    }

    async updateEvent(id, updateData) {
        const existingEvent = await eventsRepository.getById(id);
        if (!existingEvent) {
            const error = new Error("Evento no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const now = new Date();
        if (existingEvent.date <= now) {
            const error = new Error("No se puede editar un evento que ya ocurrió");
            error.statusCode = 400;
            throw error;
        }

        if (existingEvent.status === "cancelled" || existingEvent.status === "finished") {
            const error = new Error("No se puede modificar un evento cancelado o finalizado");
            error.statusCode = 400;
            throw error;
        }

        if (updateData.date) {
            const newDate = new Date(updateData.date);
            if (newDate <= now) {
                const error = new Error("La fecha del evento debe ser futura");
                error.statusCode = 400;
                throw error;
            }
            updateData.date = newDate;
        }

        if (updateData.capacity !== undefined && updateData.capacity <= 0) {
            const error = new Error("La capacidad debe ser mayor a cero");
            error.statusCode = 400;
            throw error;
        }

        if (updateData.price !== undefined && updateData.price < 0) {
            const error = new Error("El precio no puede ser negativo");
            error.statusCode = 400;
            throw error;
        }

        return await eventsRepository.update(id, updateData);
    }

    async updateStatus(id, newStatus) {
        const existingEvent = await eventsRepository.getById(id);
        if (!existingEvent) {
            const error = new Error("Evento no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const now = new Date();
        if (newStatus === "cancelled" && (existingEvent.status === "finished" || existingEvent.date <= now)) {
            const error = new Error("No se puede cancelar un evento que ya finalizó");
            error.statusCode = 400;
            throw error;
        }

        return await eventsRepository.update(id, { status: newStatus });
    }
}

export const eventsService = new EventsService();

