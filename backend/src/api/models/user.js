import { makeDBQuery } from "../../db/config.js";
import { logger } from "../../../logger.js";
import { generateUUID } from "../../utils/uuid.js";

// Get user
export const findUserById = async (userId) => {
    try {

        if (!userId) return null;

        const query = {
            name: "findUserById",
            text: "SELECT * FROM users WHERE id = $1",
            values: [userId]
        };

        const result = await makeDBQuery(query);
        return result.rows[0] || null;

    } catch (err) {
        // Logger
        logger.error(err);
    }
};

export const findUserByEmail = async (email) => {
    try {

        if (!email) throw new Error("Email not provided");

        const query = {
            name: "findUserByEmail",
            text: "SELECT * FROM users WHERE email = $1",
            values: [email]
        };

        const result = await makeDBQuery(query);
        return result.rows[0] || null;

    } catch (err) {
        // Logger
        logger.error(err);
    }
};

export const findUserByUsername = async (username) => {
    try {

        if (!username) throw new Error("Username not provided");

        const query = {
            name: "findUserByUsername",
            text: "SELECT * FROM users WHERE username = $1",
            values: [username]
        };

        const result = await makeDBQuery(query);
        return result.rows[0] || null;

    } catch (err) {
        // Logger
        logger.error(err);
    }
};

export const getUserAvatar = async (id) => {
    try {

        if (!id) throw new Error("User ID not provided");

        const query = {
            name: "getUserAvatar",
            text: "SELECT id,avatar_url,has_avatar FROM users WHERE id = $1",
            values: [id]
        };

        const result = await makeDBQuery(query);
        return result.rows[0] || null;

    } catch (err) {
        logger.error("Error getting user avatar", { err });
        throw err;
    }
};

// Helper
export const updateUserEmail = async (id, newEmail) => {
    try {

        if (!id || !newEmail) throw new Error("Missing requirements");

        const query = {
            name: "updateUserEmail",
            text: "UPDATE users SET email = $1 WHERE id = $2 RETURNING id,email",
            values: [newEmail, id]
        };

        const result = await makeDBQuery(query);
        return result.rows[0];

    } catch (err) {
        logger.error("Error updating user email", { err });
        throw err;
    }
};

export const updateUserEmailVerification = async (id, verified = false) => {
    try {

        if (!id) throw new Error("User ID not provided");

        // Verification status
        const verifyStatus = verified ? new Date().toISOString() : null;

        const query = {
            name: "updateUSerEmailVerification",
            text: "UPDATE users SET email_verified_at = $1 WHERE id = $2 RETURNING id,email,email_verified_at",
            values: [verifyStatus, id]
        };

        const result = await makeDBQuery(query);
        return result.rows[0];

    } catch (err) {
        logger.error("Error updating user email verification status", { err });
        throw err;
    }
};

export const updateUserUsername = async (id, newUsername) => {
    try {

        if (!id || !newUsername) throw new Error("Missing requirements");

        const query = {
            name: "updateUserUsername",
            text: "UPDATE users SET username = $1,updated_at = $2 WHERE id = $3 RETURNING id,email,username",
            values: [newUsername, new Date().toISOString(), id]
        };

        const result = await makeDBQuery(query);
        return result.rows[0];

    } catch (err) {
        logger.error("Error updating user username", { err });
        throw err;
    };
};

export const updateUserPassword = async (id, newPassword) => {
    try {

        if (!id, !newPassword) throw new Error("Missing requirements");

        const query = {
            name: "updateUserPassword",
            text: "UPDATE users SET password = $1,updated_at = $2 WHERE id = $3 RETURNING id,email",
            values: [newPassword, new Date().toISOString(), id]
        };

        const result = await makeDBQuery(query);
        return result.rows[0];

    } catch (err) {
        logger.error("Error updating user password", { err });
        throw err;
    }
};

export const updateUserAvatar = async (id, newAvatar) => {
    try {

        if (!id) throw new Error("Missing User ID");

        const query = {
            name: "updateUserAvatar",
            text: "UPDATE users SET avatar_url = $1,has_avatar = $2,updated_at = $3 WHERE id = $4 RETURNING id,emial,avatar_url,has_avatar",
            values: [newAvatar, newAvatar ? true : false, new Date().toISOString(), id]
        };

        const result = await makeDBQuery(query);
        return result.rows[0];

    } catch (err) {
        logger.error("Error updating user avatar", { err });
        throw err;
    }
};

export const updateUserLoginTime = async (userId) => {
    try {

        if (!userId) throw new Error("User id not provided");

        const query = {
            name: "updateUserLoginTime",
            text: "UPDATE users SET last_sign_in_at = $1 WHERE id = $2 RETURNING id,email,last_sign_in_at",
            values: [new Date().toISOString(), userId]
        };

        const result = await makeDBQuery(query);
        return result.rows[0];

    } catch (err) {
        logger.error("Error updating user login time", { err });
        throw err;
    }
};

// Can create passworded users, oauth, and passkey users
export const createUser = async ({
    email,
    username,
    password,
    hasPasskeys = false,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
    userType = "user"
}) => {
    try {

        // Generate user id
        const userId = generateUUID(email);

        // Create new db user object to be added
        let newUser = {
            id: userId,
            username,
            email,
            password,
            hasPasswordEnabled: (!password && hasPasskeys) ? false : true,
            hasPasskeys,
            createdAt,
            updatedAt,
            userType
        };

        // Make db query
        const query = {
            name: "createUser",
            text: "INSERT INTO users (id, username, email, password, has_password_enabled, passkey_enabled, user_type, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
            values: [
                newUser.id,
                newUser.username,
                newUser.email,
                newUser.password,
                newUser.hasPasswordEnabled,
                newUser.hasPasskeys,
                newUser.userType,
                newUser.createdAt,
                newUser.updatedAt,
            ]
        };

        // Make query
        const result = await makeDBQuery(query);
        return result.rows[0]; // Return the new user


    } catch (err) {
        logger.error("Error during user creation", { err });
        throw err;
    }
};

export const deleteUser = async (userId) => {
    try {
        if (!userId) throw new Error("Missing user id");

        const query = {
            name: "deleteUser",
            text: "DELETE FROM users WHERE id = $1",
            values: [userId]
        };

        await makeDBQuery(query);
        return;
    } catch (err) {
        logger.error("Error deleting user", { err });
        throw err;
    }
};

// Totp
export const addTOTPToUser = async (userId, secret) => {
    try {

        if (!userId || !secret) throw new Error("Missing user id or secret");

        const query = {
            name: "addTOTPToUser",
            text: "UPDATE users SET is_totp_enabled = $1,totp_secret = $2,updated_at = $3 WHERE id = $4",
            values: [true, secret, new Date().toISOString(), userId]
        };

        await makeDBQuery(query);
        return;

    } catch (err) {
        logger.error("Error adding TOTP to user", { err });
        throw err;
    }
};

export const deleteTOTPFromUser = async (userId) => {
    try {

        if (!userId) throw new Error("Missing user id");

        const query = {
            name: "deleteTOTPFromUser",
            text: "UPDATE users SET is_totp_enabled = $1,totp_secret = $2,updated_at = $3 WHERE id = $4",
            values: [false, null, new Date().toISOString(), userId]
        };

        await makeDBQuery(query);
        return true;

    } catch (err) {
        logger.error("Error deleting TOTP from user", { err });
        throw err;
    }
};

// Additonal Helpers
export const checkIfUsernameIsUnique = async (username) => {
    try {

        if (!username) throw new Error("Missing username");

        const query = {
            name: "checkIfUsernameIsUnique",
            text: "SELECT id FROM users WHERE username = $1",
            values: [username]
        };

        const results = await makeDBQuery(query);
        return results.rows[0] ? false : true;

    } catch (err) {
        logger.error("Error checking username uniqueness", { err });
        throw err;
    }
};