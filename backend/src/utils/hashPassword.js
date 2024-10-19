import { hash } from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {

    if (!password) throw new Error("No password provided to hash");
    
    return hash(password, SALT_ROUNDS);

};