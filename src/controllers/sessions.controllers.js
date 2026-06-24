export async function getSession(req, res, next) {
    try {
        res.json({ message: "Sessions endpoint structure" });
    } catch (error) {
        next(error);
    }
}
