
require('dotenv').config();
const admin = require("firebase-admin");
// const serviceAccount = require("./config/fcm-service-key.json");
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
console.log("✅ Firebase Admin initialized"); 

module.exports = admin; // ✅ Export the initialized admin instance
