import { usersDao } from "../dao/users.dao.js";

export class UsersRepository {
    async getAll() {
        return await usersDao.getAll();
    }

    async getById(id) {
        return await usersDao.getById(id);
    }

    async create(userData) {
        return await usersDao.create(userData);
    }

    async getByEmail(email) {
        return await usersDao.getByEmail(email);
    }
}

export const usersRepository = new UsersRepository();
