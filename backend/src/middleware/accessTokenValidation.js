// Logging
import { logger } from "../../logger";

// Helpers
import { verifyAccessToken } from "../utils/jwt";

export default async function accessTokenValidation (req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        next();
        return;
    }

    const authHeaderSplit = authHeader.split(" ");
    const token = authHeaderSplit[1];

    // Ensure token exists and is not an empty string, and Bearer is present
    if (authHeaderSplit[0] === "Bearer" && token && token.trim() !== "" && token !== undefined && token.trim().toLowerCase() !== "null") {
        try {

            // Verify the token
            const decodedToken = await verifyAccessToken(token); // returns decoded jwt, null if invalid
            
            if (decodedToken) {
                // If token is valid, set req.session
                req.session = {
                    authenticated: true,
                    user: decodedToken
                }
            }

        } catch (err) {
            console.log(err);
            logger.warn("Error decoding JWT", {token, err});
        }
    }

    // Push to routes
    next();
};