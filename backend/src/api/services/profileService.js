// Logging
import { logger } from "../../../logger.js";

// DB
import { updateUserCountryOfOrigin, updateUserLanguagesSpoken, updateUserTags } from "../models/profiles.js";

// Helpers
import { getCountryFromCountryCode, getLanguageFromCode } from "../../utils/iso.js";

export const updateCountryOfOrigin = async (userId, countryOfOrigin) => {
    try {

        if (!userId) throw new Error("User id not provided");

        // Get country code
        let modifiedCountry = null;
        if (countryOfOrigin) {
            modifiedCountry = getCountryFromCountryCode(countryOfOrigin);
        }

        const updatedUser = await updateUserCountryOfOrigin(userId, modifiedCountry);

        return updatedUser;

    } catch (err) {
        logger.error("Could not update country of origin", { err });
        throw err;
    }
};

export const updateLanguages = async (userId, languagesSpoken = []) => {
    try {

        if (!userId) throw new Error("User id not provided");

        // Get languages
        let modifiedLanguageArray = [];
        if (languagesSpoken.length > 0) {
            languagesSpoken.forEach(languageCode => {
                let fullLanguage = getLanguageFromCode(languageCode);
                modifiedLanguageArray.push(fullLanguage);
            });
        }

        const updatedUser = await updateUserLanguagesSpoken(userId, modifiedLanguageArray);

        return updatedUser;

    } catch (err) {
        logger.error("Could not update languages spoken", { err });
        throw err;
    }
};

export const updateTags = async (userId, tags = []) => {
    try {

        if (!userId) throw new Error("User id not provided");

        const updatedUser = await updateUserTags(userId, tags);

        return updatedUser;

    } catch (err) {
        logger.error("Could not update tags", { err });
        throw err;
    }
};