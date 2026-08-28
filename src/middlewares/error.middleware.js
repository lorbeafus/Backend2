export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Error interno del servidor";

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
    });
};
