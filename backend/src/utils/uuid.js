import {v5 as uuidv5} from "uuid";

// Crypto
import crypto from "crypto";

// Dotenv
import dotenv from "dotenv";
dotenv.config({path: "../../../.env"});

const namespace = process.env.UUID_NAMESPACE;

export const generateUUID = (email) => {
    // Generate random characters to ensure even repeat emails get a new uuid to stop shit from breaking
    const randomBytes = crypto.randomBytes(4).toString("hex");
    const randomizedEmail = email+randomBytes;

    return uuidv5(randomizedEmail, namespace);
};