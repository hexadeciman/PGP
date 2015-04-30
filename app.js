var CryptoJS = require ('cryptojs').Crypto;
var ursa     = require('ursa');
var fs       = require('fs');

/*
 * @args
 *   secret: the message to be encrypted
 *   pub: the public key of the receiver
 * @return dataPGP object with attributes: messageEncrypted, rndEncrypted
 */
var encryptPGP = function(secret, pub) {
  var rnd = Math.random().toString();
  var encryptedRnd = pub.encrypt(rnd, 'utf8', 'base64');
  var encryptedMessage = CryptoJS.AES.encrypt(secretData, rnd);
  return {
    message: encryptedMessage,
    rnd: encryptedRnd
  }
}

/*
 * @args
 *   dataPGP object with attributes: messageEncrypted, rndEncrypted
 *   priv: the private key of the receiver
 * @return decrypted message
 */
var decryptPGP = function(dataPGP, priv) {
  var rnd = priv.decrypt(dataPGP.rnd, 'base64', 'utf8')
  var message = CryptoJS.AES.decrypt(dataPGP.message, rnd);
  return message
}

var priv = ursa.createPrivateKey(fs.readFileSync('./keys/priv.pem', 'utf8'));
var pub = ursa.createPublicKey(fs.readFileSync('./keys/pub.pem', 'utf8'));
var secretData = '007';

var dataPGP = encryptPGP(secretData, pub);
var message = decryptPGP(dataPGP, priv);

if (secretData === message) {
  console.log('success PGP encryption/decryption');
  console.log('Message decrypted : ' + message);
} else {
  console.log('failed PGP encryption/decryption');
}
