import rateLimit from "express-rate-limit";

export default rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: async (req, res, next) => {
        res.status(429).send({ error: "Too many requests" });
    }
});