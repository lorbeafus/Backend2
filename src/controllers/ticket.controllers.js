export async function getAllTickets(req, res, next) {
    try {
        res.json({ message: "Get all tickets" });
    } catch (error) {
        next(error);
    }
}
