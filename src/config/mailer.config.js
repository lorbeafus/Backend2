import nodemailer from "nodemailer";
import { env } from "./env.js";

export const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST || "smtp.ethereal.email",
    port: Number(env.MAIL_PORT) || 587,
    secure: Number(env.MAIL_PORT) === 465,
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
    },
});

export const sendMail = async ({ to, subject, html, text }) => {
    try {
        if (!env.MAIL_USER || !env.MAIL_HOST) {
            console.log(`[Mailer Mock] Email to: ${to} | Subject: ${subject}`);
            return { messageId: "mock-id" };
        }
        const info = await transporter.sendMail({
            from: env.MAIL_FROM || '"Plataforma de Eventos" <no-reply@eventos.com>',
            to,
            subject,
            text,
            html,
        });
        return info;
    } catch (error) {
        console.error("Error al enviar email con Nodemailer:", error.message);
        return null;
    }
};
