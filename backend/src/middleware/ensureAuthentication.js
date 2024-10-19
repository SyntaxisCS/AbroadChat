export default async function ensureAuthentication (req, res, next) {
    if (req?.session?.authenticated) {
        return next();
    } else {
        return res.status(401).send({ error: "Not authenticated" });
    }
};
// Middleware to return error if user is not logged in