var admin = require("firebase-admin");

const serviceAccount = require("./config/fcm-service-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
