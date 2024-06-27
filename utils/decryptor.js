const CryptoJS = require("crypto-js")

const secretKey = process.env.ENCRYPTION_KEY || 'super-secret-key';

const decryptObject = (dataObject) => {
    const { encryptedData } = dataObject
    try {
        if (encryptedData) {
            const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8)); 
            return decryptedData
        }
        else return dataObject
    } catch (error) {
        console.error(error);
        return Promise.reject("Authentication Error");
    }
};

const decryptTextPayload = (token) => {
    try {
        const bytes = CryptoJS.AES.decrypt(token, secretKey)
        return bytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
        return null
    }
}

module.exports = {
    decryptObject,
    decryptTextPayload
};