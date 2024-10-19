import { Router } from "express";

// Controller
import { finishAuthentication, finishRegistration, startAuthentication, startRegistration } from "../controllers/passkeyController.js";

// Middleware
import generalRateLimiter from "../../middleware/rateLimiting/general.js";

const router = Router();

router.use(generalRateLimiter); // 100 requests per 15 minutes

// Registration Routes
router.post("/register/start", startRegistration);
router.post("/register/finish", finishRegistration);

// Authentication Routes
router.post("/login/start", startAuthentication);
router.post("/login/finish", finishAuthentication);

export default router;