import { usersRepository } from "../repositories/users.repository.js";

export class UsersService {
    async getUsers() {
        return await usersRepository.getAll();
    }

    async getUserById(id) {
        return await usersRepository.getById(id);
    }

    async createUser(userData) {
        return await usersRepository.create(userData);
    }
}

export const usersService = new UsersService();
