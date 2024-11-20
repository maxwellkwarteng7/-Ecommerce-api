const { totp } = require('otplib');
const crypto = require('crypto');

const generatePin = () => {
    // Generate a random secret
    function generateSecret(length = 20) {
        return crypto.randomBytes(length).toString("hex");
    }

    // Generate a secret
    const secret = generateSecret();

    // Generate a TOTP
    const pin = totp.generate(secret);
    // return token / otp
    return pin;
};

module.exports = generatePin