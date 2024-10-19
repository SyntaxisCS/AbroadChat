// Logging
import { logger } from "../../../logger.js";

// Packages
import { toDataURL } from "qrcode";
import { generateSecret, totp as seTotp } from "speakeasy";

// DB
import { addTOTPToUser } from "../models/user.js";

// Services
import { registerUser, loginUser } from "../services/passwordService.js";
import { revokeAllSessionsForUser } from "../models/sessions.js";
import { createNewSession } from "../services/sessionService.js";

// Register User
export const register = async (req, res) => {
    try {

        let user = req.body;

        // Input validation
        if (!user.email || !user.username || !user.password) return res.status(400).send({ error: "Invalid input data" });

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) return res.status(400).send({ error: "Invalid email format" });

        // Validate password format
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{10,}$/;
        if (!passwordRegex.test(user.password)) return res.status(400).send({ error: "Invalid password format" });

        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).send({ error: "Missing requirements" });

        // Register the user
        const newUser = await registerUser(user);
        res.status(201).send({ message: "New user created!", userId: newUser.id });

    } catch (err) {
        logger.error("Error occurred during traditional register process", { err });
        console.error(err);
        res.status(400).send({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {

        const { usernameEmail, password, totp } = req.body;

        // Validate if username email or password is not null, totp may be null depending on the user
        if (!usernameEmail || !password) return req.status(400).send({ error: "Missing email/username or password" });

        const { user, accessToken, refreshToken } = await loginUser(usernameEmail, password, totp);

        res.status(200).send({ accessToken, refreshToken });

    } catch (err) {
        switch (err.message) {
            case "User not found":
                return res.status(404).send({ error: "User does not exist" });
            case "Password does not match":
                return res.status(403).send({ error: "Incorrect password" });
            case "TOTP token required":
                return res.status(400).send({ error: "2FA code required" });
            case "TOTP token invalid":
                return res.status(403).send({ error: "2FA code invalid" });
            case "User has 2FA enabled, but no secret is set":
                logger.error("User has 2FA enabled, but no secret is set", { err }); // Logging as this would be a problem to looked at
                return res.status(500).send({ error: "User has 2FA enabled, but secret is not set. Please contact us to manually fix your account." });
            default:
                logger.error("Error occurred during traditional login process", { err });
                console.log(err); // FIXME: dev
                return res.status(500).send({ error: "Error occurred during login process. Please try again later or contact us for assistance." });

        }
    }
};

const savedSecrets = {}; // In memory store
export const setupTOTP = async (req, res) => { // ensure authentication is set
    try {

        // Passkey users can't setup 2FA
        // TODO: add this check to return a 403 error
        // I can only think to make a db query to get the user and then check if they have password enabled, but this feels like a waste of a db query

        const secret = generateSecret({
            name: req.session.user.email,
            issuer: process.env.APP_NAME,
            algorithm: "sha1"
        });

        // Encode the secret as base32 for compatibility with most authenticators
        const encodedSecret = secret.base32;

        // Add secret to memory, expires after 30 minutes, I would normally use redis with expiration, but too complex for this project
        savedSecrets[req.session.user.id] = encodedSecret;

        // Get auth url
        const otpauthUrl = secret.otpauth_url;

        // Generate QR Code
        const qrCode = toDataURL(otpauthUrl);

        // Send back info
        res.status(200).send({ qrCode });

    } catch (err) {
        logger.error("Error occurred during TOTP setup process", { err });
        res.status(403).send({ error: err.message });
    }
};

export const setupTOTPVerify = async (req, res) => { // ensure authentication is set
    try {

        const { code } = req.body;

        // Get stored secret
        const storedUserSecret = savedSecrets[req.session.user.id];
        if (!storedUserSecret) return res.status(400).send({ error: "TOTP secret has expired or does not exist. Please restart the setup process" });

        // Verify the TOTP code using the secret key
        const verified = seTotp.verify({
            secret: storedUserSecret,
            encoding: "base32",
            token: code,
            algorithm: "sha1",
            step: 30, // 30 seconds time period
            window: 1 // Allow +/- 30 seconds (total range 90 seconds)
        });

        if (verified) { // If code verified, add secret to user permanantely

            const added = await addTOTPToUser(req.session.user.id, storedUserSecret);

            // Revoke all sessions for user
            await revokeAllSessionsForUser(req.session.user.id, "TOTP changed");

            // Create new session
            const { accessToken, refreshToken } = await createNewSession(req.session.user.id, null, null);

            if (added) {
                res.status(200).set("x-new-session", "{\"accessToken\":\"" + accessToken + "\",\"refreshToken\":\"" + refreshToken + "\"}").send("Authorized!");
            } else {
                res.status(500).send({ error: "Internal server error" });
            }

        } else {
            res.status(403).send({ error: "Code is incorrect" });
        }

    } catch (err) {
        logger.error("Error occurred during TOTP verification process", { err });
        res.status(500).send({ error: err.message });
    }
};