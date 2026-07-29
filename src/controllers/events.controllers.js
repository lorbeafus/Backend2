import { eventsService } from "../services/events.services.js";

export async function getAll(req, res, next) {
    try {
        const result = await eventsService.getEvents(req.query);
        res.json({
            status: "success",
            payload: result.data,
            data: result.data,
            page: result.pagination.page,
            limit: result.pagination.limit,
            total: result.pagination.total,
            totalPages: result.pagination.totalPages,
            pagination: result.pagination,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ status: "error", message: error.message });
    }
}

export async function getById(req, res, next) {
    try {
        const event = await eventsService.getEventById(req.params.id);
        res.json({
            status: "success",
            payload: event,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ status: "error", message: error.message });
    }
}

export async function create(req, res, next) {
    try {
        const { title, name, description, category, date, location, place, price, capacity, status, level } = req.body;

        const eventTitle = title || name;
        const eventLocation = location || place || "Online";

        if (!eventTitle || !description || !category || !date || capacity === undefined) {
            return res.status(400).json({
                status: "error",
                message: "Los campos obligatorios (title, description, category, date, capacity) deben estar presentes",
            });
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
            payload: newEvent,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ status: "error", message: error.message });
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
            payload: updatedEvent,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ status: "error", message: error.message });
    }
}

export async function updateStatus(req, res, next) {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ status: "error", message: "El campo status es obligatorio" });
        }

        const updatedEvent = await eventsService.updateStatus(req.params.id, status);

        res.status(200).json({
            status: "success",
            message: "Estado del evento actualizado correctamente",
            payload: updatedEvent,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ status: "error", message: error.message });
    }
}

