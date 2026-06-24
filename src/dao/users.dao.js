import { userModel } from "../models/user.model.js";

export class UsersDAO {
    async getAll() {
        return await userModel.find();
    }

    async getById(id) {
        return await userModel.findById(id);
    }

    async create(data) {
        return await userModel.create(data);
    }
}

export const usersDao = new UsersDAO();
