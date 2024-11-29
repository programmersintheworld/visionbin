import Cryptr from "cryptr";
import crypto from "crypto";
const cryptr = new Cryptr(process.env.NEXT_PUBLIC_CRYPT_KEY, { pbkdf2Iterations: 9999, saltLength: 18 });

export function cryptInformation(data) {
    return cryptr.encrypt(data);
}

export function decryptInformation(data) {
    return cryptr.decrypt(data);
}

export function hashcode(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}