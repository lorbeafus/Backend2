export async function getAll(req, res, next) {
    try {
        res.json([]);
    } catch (error) {
        next(error);
    }
}
