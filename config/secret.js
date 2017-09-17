// 提供加密功能(OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)
const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    secret: crypto
}