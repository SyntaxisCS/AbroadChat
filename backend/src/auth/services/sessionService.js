import { logger } from "../../../logger";

// DB
import { createSession, findSessionByRefreshToken, revokeAllSessionsForUser, revokeSessionById, updateRefreshToken } from "../models/sessions";
import { findUserById, updateUserLoginTime } from "../models/user";

// Helpers
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../../utils/jwt";

export const createNewSession = async (userId, userAgent, ipAddress) => {
    try {

        if (!userId) throw new Error("Missing user id");

        // Get user
        const dbUser = await findUserById(userId);
        if (!dbUser) throw new Error("User not found");

        const accessToken = await createAccessToken(dbUser.id, dbUser.email, dbUser.username, dbUser.passkey_enabled);
        const refreshToken = await createRefreshToken(userId);

        // Update user login time
        await updateUserLoginTime(userId);

        // Create Session
        await createSession(userId, refreshToken, userAgent, ipAddress);

        return { accessToken, refreshToken };

    } catch (err) {
        logger.error("Could not create new session", {err});
        throw err;
    }
};

export const refreshSession = async (currentRefreshToken) => { // returns either updated session or null for invalid (new login)
    try {

        if (!currentRefreshToken) throw new Error("Missing refresh token");

        // Verify the refresh token (signature and expiration), if fails this fails, it saves a db call for getting the session
        const isValidToken = verifyRefreshToken(currentRefreshToken);
        if (!isValidToken) return null;

        // Get session from db
        const session = await findSessionByRefreshToken(currentRefreshToken);
        if (!session) return null;

        // Get user, to fill in access token
        const dbUser = await findUserById(session.user_id);
        if (!dbUser) throw new Error("User not found");

        // Generate a new token pair and update the session
        const newAccessToken = await createAccessToken(dbUser.id, dbUser.email, dbUser.username, dbUser.passkey_enabled);
        const newRefreshToken = await createRefreshToken(session.user_id);
        
        // Update session
        await updateRefreshToken(session.id, newRefreshToken);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };

    } catch (err) {
        logger.error("Could not refresh session", {err});
        throw err;
    }
};

export const revokeSession = async (sessionId) => {
    try {
        if (!sessionId) throw new Error("Missing session ID");

        await revokeSessionById(sessionId);

    } catch (err) {
        logger.error("Could not revoke session", { err });
        throw err;
    }
};

export const revokeAllSessions = async (userId) => {
    try {
        if (!userId) throw new Error("Missing user ID");

        await revokeAllSessionsForUser(userId);

    } catch (err) {
        logger.error("Could not revoke all sessions for user", { err });
        throw err;
    }
};

export const cleanupOldSessions = async () => {
    try {
        const cleanupQuery = {
            name: "cleanupOldSessions",
            text: "DELETE FROM sessions WHERE last_rotation < NOW() - INTERVAL '30 days'"
        };

        await makeDBQuery(cleanupQuery);
        logger.info("Old sessions cleanup completed");

    } catch (err) {
        logger.error("Could not cleanup old sessions", { err });
        throw err;
    }
};