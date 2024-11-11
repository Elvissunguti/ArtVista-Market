const { Timestamp } = require("firebase-admin/firestore");
const firebaseAdmin = require("firebase-admin");
const db = firebaseAdmin.firestore();

const Message = db.collection("messages");

module.exports = Message;
