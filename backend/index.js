import express from "express";
import cors from "cors";
import compression from "compression";

const app = express();
app.use(express.json());

// Dotenv
import dotenv from "dotenv";
dotenv.config();

// Logger
import { logger } from "./logger.js";

// Routes
import AuthRoutes from "./src/api/masterAuthRoutes.js";
import ProfileRoutes from "./src/api/routes/profiles.js";

// Middleware
import accessTokenValidation from "./src/middleware/accessTokenValidation.js";

// Cors
app.use(cors({
    origin: "http://localhost:9801", // Frontend url, whatever it is
    methods: ["GET", "POST", "PUT", "DELETE"] // Specify the HTTP methods to allow
}));

// Compression
const shouldCompress = async (req, res) => {
    if (req.headers["x-no-compression"]) {
        return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
};

app.use(compression({ filter: shouldCompress }));
// Compression

// Validate Access Tokens - set req.session
app.use(accessTokenValidation);

// Auth Routes
app.use("/auth", AuthRoutes);

// Routes
app.use("/profile", ProfileRoutes);

app.listen(process.env.BACKEND_PORT || 9802, () => {
    logger.info(`Server is running on port ${process.env.BACKEND_PORT || 9802}`);
});