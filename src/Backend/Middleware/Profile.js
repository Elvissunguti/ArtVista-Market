const multer = require("multer");
const path = require("path");
const admin = require('firebase-admin');
const serviceAccount = require('../Config/serviceAccountKey.json');

// Initialize Firebase Admin for profile pictures bucket
const appProfile = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'artmarketprofile'
}, 'appProfile');

const bucket = appProfile.storage().bucket();

const firebaseStorage = multer.memoryStorage();

const upload = multer({
    storage: firebaseStorage,
});

const uploadToFirebase = (file) => {
    return new Promise((resolve, reject) => {
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        const blob = bucket.file(uniquePrefix + extension);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (err) => {
            reject(err);
        });

        blobStream.on('finish', () => {
            blob.makePublic().then(() => {
                resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
            });
        });

        blobStream.end(file.buffer);
    });
};

const profilePicUploads = (req, res, next) => {
    upload.fields([{ name: 'profilePic', maxCount: 1 }])(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Failed to upload files" });
        }

        try {
            const profilePicUrls = await Promise.all(req.files.profilePic.map(file => uploadToFirebase(file)));
            req.body.profilePic = profilePicUrls[0]; // We expect only one profile picture
            next();
        } catch (uploadError) {
            console.error("Error uploading files to Firebase", uploadError);
            return res.status(500).json({ error: "Error uploading files to Firebase" });
        }
    });
};

module.exports = { profilePicUploads };
