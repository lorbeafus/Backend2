import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const generateToken = (user) => {
    return jwt.sign(user, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN || '1h'
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, env.JWT_SECRET);
};
