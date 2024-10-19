import { Router } from "express";

// Controller
import { register, login, setupTOTP, setupTOTPVerify } from "../controllers/passwordController.js";

// Middleware
import ensureAuthentication from "../../middleware/ensureAuthentication.js";
import generalRateLimiter from "../../middleware/rateLimiting/general.js";

const router = Router();

router.use(generalRateLimiter);

// Registration Route
router.post("/register", register);

// Login
router.post("/login", login);

// 2FA
router.post("/setup-2fa", ensureAuthentication, setupTOTP);
router.post("/setup-2fa/verify", ensureAuthentication, setupTOTPVerify);

export default router;