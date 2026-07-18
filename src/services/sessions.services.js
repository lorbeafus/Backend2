import { usersRepository } from "../repositories/users.repository.js";
import { createHash, isValidPassword } from "../utils/hash.js";

export class SessionsService {
    async getCurrentSession() {
        return { message: "Sessions service structure active" };
    }

    async register(userData) {
        const { first_name, last_name, email, password } = userData;

        if (!first_name || !last_name || !email || !password) {
            throw new Error("Todos los campos son obligatorios");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Formato de email inválido");
        }

        if (password.length < 6) {
            throw new Error("La contraseña debe tener al menos 6 caracteres");
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await usersRepository.getByEmail(normalizedEmail);
        if (existingUser) {
            throw new Error("Ya existe un usuario registrado con ese email");
        }

        const hashedPassword = await createHash(password);

        const newUser = await usersRepository.create({
            first_name,
            last_name,
            email: normalizedEmail,
            password: hashedPassword,
            role: "user" 
        });

        const userResponse = newUser.toObject();
        delete userResponse.password;

        return userResponse;
    }

    async login({ email, password }) {
        if (!email || !password) {
            throw new Error("Email y contraseña son obligatorios");
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await usersRepository.getByEmail(normalizedEmail);
        
        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        const validPassword = await isValidPassword(password, user.password);
        if (!validPassword) {
            throw new Error("Credenciales inválidas");
        }

        const userResponse = user.toObject();
        delete userResponse.password;

        return userResponse;
    }
}

export const sessionsService = new SessionsService();
