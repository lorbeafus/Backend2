import { eventsService } from "../services/events.services.js";
import { EventResponseDTO } from "../dto/index.js";

export async function getAll(req, res, next) {
    try {
        const result = await eventsService.getEvents(req.query);
        const dataDto = EventResponseDTO.getFrom(result.data);

        res.json({
            status: "success",
            payload: dataDto,
            data: dataDto,
            page: result.pagination.page,
            limit: result.pagination.limit,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
}

export async function getById(req, res, next) {
    try {
        const event = await eventsService.getEventById(req.params.id);
        res.json({
            status: "success",
            payload: EventResponseDTO.getFrom(event),
        });
    } catch (error) {
        next(error);
    }
}

export async function create(req, res, next) {
    try {
        const { title, name, description, category, date, location, place, price, capacity, status, level } = req.body;

        const eventTitle = title || name;
        const eventLocation = location || place || "Online";

        if (!eventTitle || !description || !category || !date || capacity === undefined) {
            const error = new Error("Los campos obligatorios (title, description, category, date, capacity) deben estar presentes");
            error.statusCode = 400;
            return next(error);
        }

        const newEvent = await eventsService.createEvent({
            title: eventTitle,
            description,
            category,
            date,
            location: eventLocation,
            price: price !== undefined ? Number(price) : 0,
            capacity: Number(capacity),
            status: status || "draft",
            level,
            organizer: req.user._id,
        });

        res.status(201).json({
            status: "success",
            message: "Evento creado correctamente",
            payload: EventResponseDTO.getFrom(newEvent),
        });
    } catch (error) {
        next(error);
    }
}

export async function update(req, res, next) {
    try {
        const { title, name, description, category, date, location, place, price, capacity, status, level } = req.body;
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        else if (name !== undefined) updateData.title = name;

        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;

        if (location !== undefined) updateData.location = location;
        else if (place !== undefined) updateData.location = place;

        if (price !== undefined) updateData.price = Number(price);
        if (capacity !== undefined) updateData.capacity = Number(capacity);
        if (status !== undefined) updateData.status = status;
        if (level !== undefined) updateData.level = level;
        if (date !== undefined) updateData.date = date;

        const updatedEvent = await eventsService.updateEvent(req.params.id, updateData);

        res.status(200).json({
            status: "success",
            message: "Evento modificado correctamente",
            payload: EventResponseDTO.getFrom(updatedEvent),
        });
    } catch (error) {
        next(error);
    }
}

export async function updateStatus(req, res, next) {
    try {
        const { status } = req.body;
        if (!status) {
            const error = new Error("El campo status es obligatorio");
            error.statusCode = 400;
            return next(error);
        }

        const updatedEvent = await eventsService.updateStatus(req.params.id, status);

        res.status(200).json({
            status: "success",
            message: "Estado del evento actualizado correctamente",
            payload: EventResponseDTO.getFrom(updatedEvent),
        });
    } catch (error) {
        next(error);
    }
}
