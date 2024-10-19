import { makeDBQuery } from "../../db/config.js";

// Logging
import { logger } from "../../../logger.js";

// Get passkey
export const getPasskey = async (credId) => {
    try {

        if (!credId) throw new Error("Missing credential id");

        const query = {
            name: "getPasskey",
            text: "SELECT * FROM user_passkeys WHERE credential_id = $1",
            values: [credId]
        };

        const result = await makeDBQuery(query);
        return result.rows.length ? result.rows[0] : null;

    } catch (err) {
        logger.error("Could not get that passkey", { err });
        throw err;
    }
};

// Get all user creds
export const findUserPasskeys = async (userId) => {
    try {

        if (!userId) throw new Error("Missing user id");

        const query = {
            name: "findUserPasskeys",
            text: "SELECT * FROM user_passkeys WHERE user_id = $1",
            values: [userId]
        };

        const result = await makeDBQuery(query);
        return result.rows ? result.rows : null;

    } catch (err) {
        console.error(err); // FIXME: dev logging
        logger.error("Could not get user passkeys", { err });
        return null;
    }
};

// Save passkey
export const savePasskeyToUser = async (userId, credential) => {
    try {

        if (!userId || !credential) throw new Error("Missing requirements");

        const query = {
            name: "savePasskeyToUser",
            text: `
                WITH passkey_insert AS (
                    INSERT INTO user_passkeys (user_id, credential_id, public_key, counter, date_created)
                    VALUES ($1,$2,$3,$4,$5)
                    RETURNING *
                )
                UPDATE users
                SET passkey_enabled = TRUE,updated_at = CURRENT_TIMESTAMP
                WHERE id = $6 AND passkey_enabled = FALSE
            `,
            values: [userId, credential.id, credential.publicKey, credential.counter, new Date().toISOString(), userId]
        };

    } catch (err) {
        logger.error("Could not create passkey for user - passkeys.js", { err });
        throw err;
    }
};

// Delete passkey
export const deletePasskeyFromUser = async (userId, credId) => { // TODO: untested
    try {

        if (!userId || !credId) throw new Error("Missing requirements");

        const query = { // deadass this thing isn't working, I'm trying but it ain't. I can get it to delete the passkey from the user_passkeys table but not set passkey_enabled to false if deleting the last passkey for user
            name: "deletePasskeyFromUser",
            text: `
                WITH delete_passkey AS (
                    DELETE FROM user_passkeys
                    WHERE user_id = $1 AND credential_id = $2
                    RETURNING *
                )
                UPDATE users
                SET passkey_enabled = (
                    SELECT CASE 
                        WHEN COUNT(*) = 0 THEN FALSE
                        ELSE TRUE
                    END
                    FROM user_passkeys
                    WHERE user_id = $3
                )
                WHERE id = $4;
            `,
            values: [userId, credId, userId, userId]
        };

        const result = await makeDBQuery(query);
        return true;

    } catch (err) {
        logger.error("Could not delete passkey from user", { err });
        throw err;
    }
};

// Update passkey counter
export const updatePasskeyCounter = async (userId, credential) => {
    try {

        if (!userId || !credential) throw new Error("Missing requirements");

        const query = {
            name: "updatePasskeyCounter",
            text: "UPDATE user_passkeys SET counter = $1,last_used = $2 WHERE user_id = $3 AND credential_id = $4",
            values: [credential.counter, new Date().toISOString(), userId, credential.id]
        };

        await makeDBQuery(query);
        return true;

    } catch (err) {
        logger.error("Could not update passkey counter", { err });
        throw err;
    }
};