import { Router } from "express";

// Logging
import { logger } from "../../logger.js";

// Routes
import PasswordRoutes from "./routes/passwordRoutes.js";
import PasskeyRoutes from "./routes/passkeyRoutes.js";

// Services
import { refreshSession } from "./services/sessionService.js";

const router = Router();

// Routes
router.use("/traditional", PasswordRoutes);

// Passkeys
router.use("/passkey", PasskeyRoutes);

// Utility
router.post("/refresh", async (req, res) => {
    try {
        console.log(req.session); // FIXME: remove my ass

        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).send({ error: "Refresh token is required" });

        // Attempt to refresh the session
        const updatedSession = await refreshSession(refreshToken);
        // Updated session returns null for a bad session (for any reason)
        if (!updatedSession) return res.status(401).send({ error: "Invalid refresh token" });

        // If updated session is not null, it returns a new access token and refresh token pair. Just trust the process
        res.json({
            accessToken: updatedSession.accessToken,
            refreshToken: updatedSession.refreshToken
        });

    } catch (err) {
        logger.error("Error in refresh auth route", { err });
        res.status(500).send({ error: "Internal server error" });
    }
});

export default router;