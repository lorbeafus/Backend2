import passport from "passport";

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                const message = info?.message || (info ? info.toString() : "Unauthorized");

                if (strategy === "register") {
                    if (message === "Ya existe un usuario registrado con ese email") {
                        return res.status(409).json({ status: "error", message });
                    }
                    if (
                        message === "Todos los campos son obligatorios" ||
                        message === "Missing credentials" ||
                        message.includes("contraseña") ||
                        message.includes("email") ||
                        message === "Formato de email inválido" ||
                        message === "La contraseña debe tener al menos 6 caracteres"
                    ) {
                        const errMsg = message === "Missing credentials" ? "Todos los campos son obligatorios" : message;
                        return res.status(400).json({ status: "error", message: errMsg });
                    }
                    return res.status(400).json({ status: "error", message });
                }

                if (strategy === "login") {
                    if (message === "Email y contraseña son obligatorios" || message === "Missing credentials") {
                        return res.status(400).json({ status: "error", message: "Email y contraseña son obligatorios" });
                    }
                    return res.status(401).json({ status: "error", message: "Credenciales inválidas" });
                }

                if (strategy === "current") {
                    const infoString = info ? info.toString() : "";
                    const isNoToken = message.includes("No auth token") || infoString.includes("No auth token");
                    const errMsg = isNoToken ? "No autenticado" : "Token inválido o expirado";
                    return res.status(401).json({ status: "error", message: errMsg });
                }

                return res.status(401).json({ status: "error", message });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};
