import { usersService } from "../services/users.services.js";
import { UserDTO } from "../dto/index.js";

export class UsersController {
    static async getAllUsers(req, res, next) {
        try {
            const users = await usersService.getUsers();
            const usersDto = UserDTO.getFrom(users);
            res.status(200).json({
                status: "success",
                payload: usersDto,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const getAllUsers = UsersController.getAllUsers;
