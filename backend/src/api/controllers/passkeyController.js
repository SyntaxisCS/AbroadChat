import { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } from "@simplewebauthn/server";
import { isoUint8Array } from "@simplewebauthn/server/helpers";
import base64url from "base64url";

// Logging
import { logger } from "../../../logger.js";

// DB
import { findUserPasskeys, getPasskey, savePasskeyToUser, updatePasskeyCounter } from "../models/passkeys.js";
import { createUser, findUserByEmail } from "../models/user.js";
import { createNewSession } from "../services/sessionService.js";

// Helpers
import { encryptPublicKey, decryptPublicKey } from "../../utils/passkeyEncryption.js";

// Setup a challenge store
let sessionChallenge = {};

// Start registration
export const startRegistration = async (req, res) => {
    try {

        const { email } = req.body;
        if (!email) return res.status(400).send({ error: "Missing email" });

        // Get user
        let user = await findUserByEmail(email);

        // User does not exist, create it first
        if (!user) {
            user = await createUser({
                email,
                username: null,
                password: null,
                oauthProvider: null,
                oauthClientID: null,
                hasPasskeys: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                userType: "user"
            });
        }

        // Get user's existing creds
        let excludeCredentials = [];

        if (user) {
            const userCreds = await findUserPasskeys(user.id);

            if (userCreds && userCreds.length > 0) {
                excludeCredentials = userCreds.map(cred => ({
                    id: base64url.decode(cred.credential_id),
                    type: "public-key",
                    transports: ["usb", "ble", "nfc", "internal"]
                }));
            }
        }

        const options = await generateRegistrationOptions({
            rpName: process.env.APP_NAME,
            rpID: process.env.WEBAUTHN_RP_ID,
            userID: isoUint8Array.fromUTF8String(user.id),
            userName: email,
            userDisplayName: user.username || email,
            timeout: 60000,
            attestationType: "indirect",
            authenticatorSelection: {
                authenticatorAttachment: "platform",
                requireResidentKey: true,
                residentKey: "required"
            },
            extensions: {
                credProps: true // Enable credProps to get user agents
            },
            // existing credentials, so the user can register multiple devices
            excludeCredentials
        });

        sessionChallenge[user.id] = options.challenge;

        res.json(options);

    } catch (err) {
        logger.error("Error during passkey registration process", { err });
        res.status(500).send({ error: "Error during passkey registration" });
    }
};

// Finish registration
export const finishRegistration = async (req, res) => {
    const { email, attResp } = req.body;
    if (!email || !attResp) return res.status(400).send({ error: "Missing requirements" });

    // Get user
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).send({ error: "User not found" });

    const expectedChallenge = sessionChallenge[user.id]; // FIXME: actual session

    const verification = await verifyRegistrationResponse({
        response: attResp,
        expectedChallenge,
        expectedOrigin: process.env.WEBAUTHN_EXPECTED_ORIGIN,
        expectedRPID: process.env.WEBAUTHN_RP_ID
    });

    if (!verification.verified) return res.status(403).send({ error: "Verification Failed" });

    const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;

    await savePasskeyToUser(user.id, {
        id: base64url.encode(credentialID),
        publicKey: await encryptPublicKey(credentialPublicKey),
        counter
    });

    delete sessionChallenge[user.id];

    // Create new session
    const { accessToken, refreshToken } = await createNewSession(user.id, null, null);

    res.status(201).send({ verified: verification.verified, accessToken, refreshToken });
};

// Start authentication
export const startAuthentication = async (req, res) => {

    const options = await generateAuthenticationOptions({
        rpID: process.env.WEBAUTHN_RP_ID,
        userVerification: 'preferred',
        allowCredentials: [] // allow any credential
    });

    sessionChallenge[options.challenge] = options.challenge;

    res.json(options);
};

// Finish authentication
export const finishAuthentication = async (req, res) => {
    const { authResp } = req.body;

    const credentialId = authResp.id;

    const passkey = await getPasskey(base64url.encode(credentialId));
    if (!passkey) return res.status(404).send({ error: "No passkey found with that id" });

    const decodedClientDataJSON = JSON.parse(base64url.decode(authResp.response.clientDataJSON));
    const expectedChallenge = sessionChallenge[decodedClientDataJSON.challenge];

    const existingCred = {
        credentialID: base64url.decode(passkey.credential_id),
        public_key: await decryptPublicKey(passkey.public_key),
        counter: parseInt(passkey.counter)
    };

    const verification = await verifyAuthenticationResponse({
        response: authResp,
        expectedChallenge,
        expectedOrigin: process.env.WEBAUTHN_EXPECTED_ORIGIN,
        expectedRPID: process.env.WEBAUTHN_RP_ID,
        authenticator: {
            credentialPublicKey: existingCred.public_key,
            counter: existingCred.counter,
            credentialID: existingCred.credentialID
        }
    });

    if (!verification.verified) return res.status(403).send({ error: "Verification failed" });

    // Update the passkey's counter
    await updatePasskeyCounter(passkey.user_id, {
        id: base64url.encode(existingCred.credentialID),
        counter: verification.authenticationInfo.newCounter
    });

    // Delete challenge
    delete sessionChallenge[expectedChallenge];

    // Create new session
    const { accessToken, refreshToken } = await createNewSession(passkey.user_id, null, null);

    return res.status(200).send({ verified: verification.verified, accessToken, refreshToken });
};