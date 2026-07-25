import { eventsService } from "../services/events.services.js";

export async function getAll(req, res, next) {
    try {
        const events = await eventsService.getEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

export async function create(req, res, next) {
    try {
        const { name, date, place, price, capacity, status } = req.body;

        if (!name || !date || !place || price === undefined || capacity === undefined) {
            return res.status(400).json({ status: "error", message: "Todos los campos obligatorios deben estar presentes" });
        }

        if (price < 0) {
            return res.status(400).json({ status: "error", message: "El precio no puede ser negativo" });
        }

        if (capacity <= 0) {
            return res.status(400).json({ status: "error", message: "La capacidad debe ser mayor a cero" });
        }

        const eventDate = new Date(date);
        const now = new Date();
        if (eventDate <= now) {
            return res.status(400).json({ status: "error", message: "La fecha del evento debe ser futura" });
        }

        // organizer is automatically assigned from req.user._id, ignoring body organizer
        const newEvent = await eventsService.createEvent({
            name,
            date: eventDate,
            place,
            price,
            capacity,
            status: status !== undefined ? status : true,
            organizer: req.user._id,
        });

        res.status(201).json({
            status: "success",
            message: "Evento creado correctamente",
            payload: newEvent,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}

export async function update(req, res, next) {
    try {
        const { name, date, place, price, capacity, status } = req.body;
        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (place !== undefined) updateData.place = place;
        if (status !== undefined) updateData.status = status;

        if (price !== undefined) {
            if (price < 0) {
                return res.status(400).json({ status: "error", message: "El precio no puede ser negativo" });
            }
            updateData.price = price;
        }

        if (capacity !== undefined) {
            if (capacity <= 0) {
                return res.status(400).json({ status: "error", message: "La capacidad debe ser mayor a cero" });
            }
            updateData.capacity = capacity;
        }

        if (date !== undefined) {
            const eventDate = new Date(date);
            const now = new Date();
            if (eventDate <= now) {
                return res.status(400).json({ status: "error", message: "La fecha del evento debe ser futura" });
            }
            updateData.date = eventDate;
        }

        const updatedEvent = await eventsService.updateEvent(req.params.id, updateData);

        res.status(200).json({
            status: "success",
            message: "Evento modificado correctamente",
            payload: updatedEvent,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
}
