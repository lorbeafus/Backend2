import { usersRepository } from "../repositories/users.repository.js";

export class UsersService {
    async getUsers() {
        return await usersRepository.getAll();
    }

    async getUserById(id) {
        return await usersRepository.getById(id);
    }

    async createUser(data) {
        return await usersRepository.create(data);
    }
}

export const usersService = new UsersService();
