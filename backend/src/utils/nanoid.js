import { customAlphabet } from "nanoid";

// Set custom alphabet
const nanoAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

// General token (password reset, email verify)
export const generateNanoId = async (length = 64) => {
    let nano = customAlphabet(nanoAlphabet, length);

    return nano();
};