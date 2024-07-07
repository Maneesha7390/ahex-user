const CryptoJS = require('crypto-js');

module.exports ={
    decrypt
}

function decrypt(encryptedText, key){
    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  }