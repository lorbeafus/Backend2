import { ticketModel } from "../models/ticket.model.js";
import mongoose from "mongoose";

export class TicketsDAO {
    async getAll() {
        return await ticketModel
            .find()
            .populate("user", "first_name last_name email role")
            .populate("event");
    }

    async getById(id) {
        return await ticketModel
            .findById(id)
            .populate("user", "first_name last_name email role")
            .populate("event");
    }

    async getByUser(userId) {
        return await ticketModel
            .find({ user: userId })
            .populate("event", "title description date location price category status")
            .sort({ createdAt: -1 });
    }

    async getByEvent(eventId) {
        return await ticketModel
            .find({ event: eventId })
            .populate("user", "first_name last_name email role")
            .sort({ createdAt: -1 });
    }

    async findActiveByUserAndEvent(userId, eventId) {
        return await ticketModel.findOne({
            user: userId,
            event: eventId,
            status: { $ne: "cancelled" },
        });
    }

    async getReservedQuantityByEvent(eventId) {
        const objectId = mongoose.Types.ObjectId.isValid(eventId)
            ? new mongoose.Types.ObjectId(eventId)
            : eventId;

        const result = await ticketModel.aggregate([
            {
                $match: {
                    event: objectId,
                    status: { $ne: "cancelled" },
                },
            },
            {
                $group: {
                    _id: "$event",
                    totalReserved: {
                        $sum: "$quantity",
                    },
                },
            },
        ]);

        return result[0]?.totalReserved || 0;
    }

    async create(ticketData) {
        return await ticketModel.create(ticketData);
    }

    async update(id, updateData) {
        return await ticketModel.findByIdAndUpdate(id, updateData, {
            new: true,
            returnDocument: "after",
        });
    }
}

export const ticketsDao = new TicketsDAO();
