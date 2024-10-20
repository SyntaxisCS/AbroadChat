// Logging
import { logger } from "../../../logger.js";

// DB
import { findUserProfileById } from "../models/profiles.js";

// Services
import { updateCountryOfOrigin, updateLanguages } from "../services/profileService.js";

// Get user profile
export const getProfile = async (req, res) => { // ensure authentication is set
    try {

        // Get profile
        const userProfile = await findUserProfileById(req.session.user.id);

        return res.status(200).send({ profile: userProfile });

    } catch (err) {
        logger.error("Error occurred getting user profile", { err });
        res.status(500).send({ error: err.message });
    }
};

export const setCountryOfOrigin = async (req, res) => { // ensure authentication is set
    try {

        const { coo } = req.body;

        if (coo.trim() === "") { // can be null but not an empty string
            return res.status(400).send({ error: "Country of origin not provided" });
        }

        const updatedUser = await updateCountryOfOrigin(req.session.user.id, coo);;

        return res.status(201).send({ updated: updatedUser });

    } catch (err) {
        logger.error("Error occurred whensetting user country of origin", { err });
        res.status(500).send({ error: err.message });
    }
};

export const setLanguages = async (req, res) => { // ensure authentication is set
    try {

        const { languages } = req.body;

        const updatedUser = !Array.isArray(languages) ? await updateLanguages(req.session.user.id, []) : await updateLanguages(req.session.user.id, languages);

        return res.status(201).send({ updated: updatedUser });

    } catch (err) {
        logger.error("Error occurred when setting user spoken languages", { err });
        res.status(500).send({ error: err.message });
    }
};