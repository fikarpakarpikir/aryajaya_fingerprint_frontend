import CryptoJS from "crypto-js";
import { serialize, unserialize } from "php-serialize";

// declare global {
//     interface Window {
//         Buffer: typeof Buffer;
//     }
// }

window.Buffer = window.Buffer;

const appKey = "+RpriWtAj1gSPgHh0bHn017wTjbVWArKgHBfGDG+ieM=";
// const appKey = "base64:+RpriWtAj1gSPgHh0bHn017wTjbVWArKgHBfGDG+ieM=";

// Hash the app key to create a 32-byte key (AES-256)
const key = CryptoJS.enc.Base64.parse(appKey);

function encLaravel(value, cipher = "aes-256-cbc", serializeCond = true) {
    try {
        const keyWordArray = CryptoJS.enc.Base64.parse(appKey);
        const iv = CryptoJS.lib.WordArray.random(16);

        const serializedValue = serializeCond ? serialize(value) : value; // Encrypt the value
        const encrypted = CryptoJS.AES.encrypt(serializedValue, keyWordArray, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        const ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

        const ivBase64 = iv.toString(CryptoJS.enc.Base64);
        const mac = CryptoJS.HmacSHA256(
            CryptoJS.enc.Utf8.parse(ivBase64 + ciphertext),
            key
        ).toString(CryptoJS.enc.Hex); // Create the payload matching Laravel's structure
        const payload = {
            iv: ivBase64,
            value: ciphertext,
            mac: mac,
        };

        return CryptoJS.enc.Base64.stringify(
            CryptoJS.enc.Utf8.parse(JSON.stringify(payload))
        );
    } catch (error) {
        throw new Error("Could not encrypt the data:" + error);
    }
}

// Decryption function (AES-256-CBC)
function decLaravel(payload, unserializeCond = true) {
    try {
        // Decode the payload from Base64
        const decodedPayload = JSON.parse(
            CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(payload))
        );

        const { iv, value, mac, tag } = decodedPayload;

        // Decode IV and Tag (optional)
        const ivWordArray = CryptoJS.enc.Base64.parse(iv);
        const tagWordArray = tag ? CryptoJS.enc.Base64.parse(tag) : null;

        // Validate MAC
        const computedMac = CryptoJS.HmacSHA256(iv + value, key).toString(
            CryptoJS.enc.Hex
        );

        if (computedMac !== mac) {
            throw new Error("The MAC is invalid.");
        }

        // Decrypt the value
        const decrypted = CryptoJS.AES.decrypt(value, key, {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) {
            throw new Error("Could not decrypt the data.");
        }

        // Optionally unserialize the data
        // return unserializeCond ? unserialize(decryptedString) : decryptedString;
        return decryptedString;
    } catch (error) {
        throw new Error("Decryption failed: " + error.message);
    }
}

export { encLaravel, decLaravel };
