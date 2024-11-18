// firebaseAdmin.js
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://artvista-market.firebaseio.com",
  });
}

const db = admin.firestore();

module.exports = { admin, db };
