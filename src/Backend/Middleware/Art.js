const multer = require("multer");
const path = require("path");
const admin = require('firebase-admin');
const serviceAccount = require('../Config/serviceAccountKey.json');

// Initialize Firebase Admin for art photos bucket
const appArt = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'artworkimages'
}, 'appArt');

const bucket = appArt.storage().bucket();

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

const artUploads = (req, res, next) => {
    upload.fields([{ name: 'artPhoto', maxCount: 10 }])(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Failed to upload files" });
        }

        try {
            const artPhotoUrls = await Promise.all(req.files.artPhoto.map(file => uploadToFirebase(file)));
            req.body.artPhoto = artPhotoUrls;
            next();
        } catch (uploadError) {
            console.error("Error uploading files to Firebase", uploadError);
            return res.status(500).json({ error: "Error uploading files to Firebase" });
        }
    });
};

module.exports = { artUploads };
