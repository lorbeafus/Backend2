import { sessionsService } from "../services/sessions.services.js";
import { env } from "../config/env.js";
import { generateToken } from "../utils/jwt.js";

export async function getSession(req, res, next) {
    try {
        res.status(200).json({
            status: 'success',
            payload: req.user
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

export async function registerUser(req, res, next) {
    try {
        const user = await sessionsService.register(req.body);
        res.status(201).json({
            status: "success",
            message: "Usuario registrado correctamente",
            payload: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        if (error.message === "Ya existe un usuario registrado con ese email") {
            return res.status(409).json({ status: "error", message: error.message });
        }
        res.status(400).json({ status: "error", message: error.message });
    }
}

export async function loginUser(req, res, next) {
    try {
        const user = await sessionsService.login(req.body);
        
        const tokenUser = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        
        const token = generateToken(tokenUser);
        
        res.cookie('currentUser', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: 'lax',
            secure: env.NODE_ENV === 'production'
        });

        res.status(200).json({
            status: "success",
            message: "Login exitoso"
        });
    } catch (error) {
        if (error.message === "Credenciales inválidas") {
            return res.status(401).json({ status: "error", message: error.message });
        }
        res.status(400).json({ status: "error", message: error.message });
    }
}

export async function logoutUser(req, res, next) {
    try {
        res.clearCookie('currentUser');
        res.status(200).json({
            status: 'success',
            message: 'Logout correcto'
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}
