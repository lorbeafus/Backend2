import { Schema, model } from "mongoose";

const eventSchema = new Schema({
    name: String,
    data: Date,
    place: String,
    price: Number,
    capacity: Number,
    status: Boolean,

});

export const eventModel = model("event", eventSchema);