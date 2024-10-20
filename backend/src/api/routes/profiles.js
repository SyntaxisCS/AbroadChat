import { Router } from "express";

// Controller
import { getProfile, setCountryOfOrigin, setLanguages } from "../controllers/profileController.js";

// Middleware
import ensureAuthentication from "../../middleware/ensureAuthentication.js";
import generalRateLimiter from "../../middleware/rateLimiting/general.js";

const router = Router();

router.use(generalRateLimiter);

// Getting profile
router.get("/", ensureAuthentication, getProfile);

// Profile update
router.put("/set/country-of-origin", ensureAuthentication, setCountryOfOrigin);

router.put("/set/languages-spoken", ensureAuthentication, setLanguages);

export default router;