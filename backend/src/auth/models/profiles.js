// DB
import { makeDBQuery } from "../../db/config.js";

// Logging
import { logger } from "../../../logger.js";

// Get user profile
export const findUserProfileById = async (userId) => {
    try {

        if (!userId) return null;

        const query = {
            name: "findUserProfileById",
            text: "SELECT * FROM user_profiles WHERE user_id = $1",
            values: [userId]
        };

        const result = await makeDBQuery(query);
        return result.rows[0] || null;

    } catch (err) {
        // Logger
        logger.error(err);
        throw err;
    }
};

export const findUserProfileByEmail = async (email) => {
    try {

        if (!email) throw new Error("Email not provided");

        const query = {
            name: "findUserProfileByEmail",
            text: "SELECT * FROM user_profiles WHERE user_id = $1",
            values: [email]
        };

        const result = await makeDBQuery(query);
        return result.rows[0] || null;

    } catch (err) {
        // Logger
        logger.error(err);
        throw err;
    }
};

export const findUserProfileByUsername = async (username) => {
    try {

        if (!username) throw new Error("Username not provided");

        const query = {
            name: "findUserProfileByUsername",
            text: "SELECT * FROM user_profiles WHERE user_id = $1",
            values: [username]
        };

        const result = await makeDBQuery(query);
        return result.rows[0] || null;

    } catch (err) {
        // Logger
        logger.error(err);
        throw err;
    }
};

export const updateUserCountryOfOrigin = async (userId, countryOfOrigin) => {
    try {

        if (!userId) throw new Error("User Id not provided");

        const query = {
            name: "updateUserCountryOfOrigin",
            text: "UPDATE user_profiles SET country_of_origin = $1,updated_at = $2 WHERE id = $3 RETURNING id,country_of_origin",
            values: [countryOfOrigin, new Date().toISOString(), userId]
        };

        const result = await makeDBQuery(query);
        return result.rows[0];

    } catch (err) {
        // Logger
        logger.error(err);
        throw err;
    }
};

export const updateUserLanguagesSpoken = async (userId, languages = []) => {
    try {

        if (!userId) throw new Error("User id not provided");

        const query = {
            name: "updateUserLanguagesSpoken",
            text: "UPDATE user_profiles SET languages_spoken = $1,updated_at = $2 WHERE id = $3 RETURNING id,languages_spoken",
            values: [languages, new Date().toISOString(), userId]
        };

        const result = await makeDBQuery(query);
        return result.rows[0];

    } catch (err) {
        // Logger
        logger.error(err);
        throw err;
    }
};

export const updateUserTags = async (userId, tags = []) => {
    try {

        if (!userId) throw new Error("User id not provided");

        const query = {
            name: "updateUserTags",
            text: "UPDATE user_profiles SET tags = $1,updated_at = $2 WHERE id = $3 RETURNING id,tags",
            values: [tags, new Date().toISOString(), userId]
        };

        const result = await makeDBQuery(query);
        return result.rows[0];

    } catch (err) {
        // Logger
        logger.error(err);
        throw err;
    }
};