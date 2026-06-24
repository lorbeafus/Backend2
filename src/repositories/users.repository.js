import { usersDao } from "../dao/users.dao.js";

export class UsersRepository {
    async getAll() {
        return await usersDao.getAll();
    }

    async getById(id) {
        return await usersDao.getById(id);
    }

    async create(data) {
        return await usersDao.create(data);
    }
}

export const usersRepository = new UsersRepository();
