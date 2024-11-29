import crypto from "crypto";
export const generateID = () => {
    return crypto.randomBytes(8).toString("hex");
};