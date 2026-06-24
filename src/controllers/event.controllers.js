export async function getAll(req, res, next) {
    try {
        res.json({ message: "Get all events" });
    } catch (error) {
        next(error);
    }
}
