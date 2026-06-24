import { usersService } from "../services/users.services.js";

export class UsersController {
    static async getAllUsers(req, res, next) {
        try {
            const users = await usersService.getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error", message: error.message });
        }
    }
}

export const getAllUsers = UsersController.getAllUsers;
