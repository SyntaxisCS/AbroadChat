import jwt from "jsonwebtoken";

export const createAccessToken = async (userId, email, username, hasPasskeys = false) => {
    if (!userId || !email || !username) throw new Error("Missing user id");

    const token = jwt.sign({
        id: userId,
        email,
        username,
        hasPasskeys
    }, process.env.JWT_SECRET, {expiresIn: "15m"});

    return token;
};

export const createRefreshToken = async (userId) => {
    if (!userId) throw new Error("Missing user id");

    const token = jwt.sign({id: userId}, process.env.JWT_REFRESH_SECRET, {expiresIn: "7d"});

    return token;
};

export const verifyAccessToken = async (token) => {
    try {

        if (!token) throw new Error("Missing token");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return decoded;
    } catch (err) {
        // Token is invalid or expired
        return false;
    }
};

export const verifyRefreshToken = async (token) => {
    try {

        if (!token) throw new Error("Missing token");

        jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        return true;
    } catch (err) {
        // Token is invalid or expired
        return false;
    }
};