// firebaseAdmin.js
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://artvista-market.firebaseio.com",
  });
}

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

module.exports = { admin, db, FieldValue };
