// Service for username/password users (traditional)
import { totp as speakTOTP } from "speakeasy";
import bcrypt from "bcrypt";

// Logging
import { logger } from "../../../logger.js";

// DB
import { createUser, findUserByEmail, findUserByUsername } from "../models/user.js";

// Helpers
import { createNewSession } from "./sessionService.js";
import { hashPassword } from "../../utils/hashPassword.js"

// Register a new user
export const registerUser = async (userObject) => {
    const { email, username, password, userType } = userObject;

    // Check if the user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) throw new Error("User already exists");

    // Hash password with a salt
    const hashedPassword = await hashPassword(password);

    // Create user in the database
    const timestamp = new Date().toISOString();
    const newUser = await createUser({
        email,
        username,
        password: hashedPassword,
        hasPasskeys: false,
        createdAt: timestamp,
        updatedAt: timestamp,
        userType
    });

    return newUser;
};

// Login User
export const loginUser = async (usernameEmail, password, totpToken) => {
    let getUserPromise;

    // Determine if email or not
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(usernameEmail);

    getUserPromise = isEmail ? findUserByEmail(usernameEmail) : findUserByUsername(usernameEmail); // find by username or email, depending

    // get user
    const user = await getUserPromise; // FIXME: maybe needs a () at the end, brain no worky
    if (!user) throw new Error("User not found");

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Password does not match");

    // Check if totp is enabled
    if (user.is_totp_enabled) {

        // Totp is enabled, check for token
        if (!totpToken) throw new Error("TOTP token required");
        if (!user.totp_secret) throw new Error("User has 2FA enabled, but no secret is set");

        // Verify code
        const verified = await verifyTOTP(user, totpToken);

        if (!verified) throw new Error("TOTP token invalid");
    }

    // Create new session
    const { accessToken, refreshToken } = await createNewSession(user.id, null, null);

    return { user, accessToken, refreshToken };
};

// Helpers
export const verifyTOTP = async (existingUser, token) => {
    try {

        if (!existingUser || !token) throw new Error("Missing user object or token");

        // Double check if user has totp enabled
        if (!existingUser.is_totp_enabled) throw new Error("User does not have TOTP enabled");

        const verified = speakTOTP.verify({
            token,
            secret: existingUser.totp_secret,
            encoding: "base32",
            algorithm: "sha1",
            step: 30,
            window: 1
        });

        // Return true/false depending on if it passes
        return verified;

    } catch (err) {
        switch (err.message) {
            case "Missing user object or token":
                logger.warn("Missing user object or token during TOTP verification", { err });
                return false;
            default:
                logger.error("Error during TOTP verification", { err });
                return false;
        }
    }
};
