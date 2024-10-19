import { makeDBQuery } from "../../db/config.js";

import { logger } from "../../../logger.js";

export const getAllUserSessionsByUserId = async (userId) => {
    try {
        if (!userId) throw new Error("Missing user id");

        const query = {
            name: "getAllUserSessionsByUserId",
            text: "SELECT * FROM user_sessions WHERE user_id = $1",
            values: [userId]
        };

        const result = await makeDBQuery(query);
        return result.rows ? result.rows : null;

    } catch (err) {
        logger.error("Could not get all user sessions by user id", { err });
        throw err;
    }
};

export const findSessionById = async (sessionId) => {
    try {
        if (!sessionId) throw new Error("Missing session ID");

        const query = {
            name: "findSessionById",
            text: "SELECT * FROM user_sessions WHERE id = $1",
            values: [sessionId]
        };

        const result = await makeDBQuery(query);
        return result.rows[0] ? result.rows[0] : null;

    } catch (err) {
        logger.error("Could not find session by ID", { err });
        throw err;
    }
};

export const createSession = async (userId, refreshToken, userAgent = null, ipAddress = null) => {
    try {

        if (!userId || !refreshToken) throw new Error("Missing user id or refresh token");

        const query = {
            name: "createSession",
            text: "INSERT INTO user_sessions (user_id, refresh_token, user_agent, ip_address, last_rotation, expires_at) VALUES ($1,$2,$3,$4,NOW(),NOW() + INTERVAL '90 days') RETURNING *",
            values: [userId, refreshToken, userAgent, ipAddress]
        };

        const result = await makeDBQuery(query);
        return result.rows[0] ? result.rows[0] : null;

    } catch (err) {
        logger.error("Could not create session", { err });
        throw err;
    }
};

export const updateRefreshToken = async (sessionId, newRefreshToken) => {
    try {
        if (!sessionId || !newRefreshToken) throw new Error("Missing requirements");

        const query = {
            name: "updateRefreshToken",
            text: `UPDATE user_sessions SET refresh_token = $1, last_rotation = NOW() WHERE id = $2 RETURNING *`,
            values: [newRefreshToken, sessionId]
        };

        const result = await makeDBQuery(query);
        return result.rows[0] ? result.rows[0] : null;

    } catch (err) {
        logger.error("Could not update refresh token", { err });
        throw err;
    }
};

export const revokeSessionById = async (sessionId, reason = "Backend revoked") => {
    try {
        if (!sessionId) throw new Error("Missing session ID");

        const query = {
            name: "revokeSessionById",
            text: "UPDATE user_sessions SET revoked = TRUE,revoked_reason = $1,revoked_at = CURRENT_TIMESTAMP WHERE id = $2",
            values: [reason, sessionId]
        };

        await makeDBQuery(query);
        return true;

    } catch (err) {
        logger.error("Could not revoke session by ID", { err });
        throw err;
    }
};

export const revokeAllSessionsForUser = async (userId, reason = "Backend revoked") => {
    try {
        if (!userId) throw new Error("Missing user ID");

        const query = {
            name: "revokeAllSessionsForUser",
            text: "UPDATE user_sessions SET revoked = TRUE,revoked_reason = $1,revoked_at = CURRENT_TIMESTAMP WHERE user_id = $2",
            values: [reason, userId]
        };

        await makeDBQuery(query);
        return true;

    } catch (err) {
        logger.error("Could not revoke all sessions for user", { err });
        throw err;
    }
};

export const findSessionByRefreshToken = async (refreshToken) => {
    try {
        if (!refreshToken) throw new Error("Missing refresh token");

        const query = {
            name: "findSessionByRefreshToken",
            text: "SELECT * FROM user_sessions WHERE refresh_token = $1",
            values: [refreshToken]
        };

        const result = await makeDBQuery(query);
        return result.rows[0] ? result.rows[0] : null;

    } catch (err) {
        logger.error("Could not find session by refresh token", { err });
        throw err;
    }
};