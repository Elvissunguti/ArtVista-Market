const express = require("express");
const passport = require("passport");
const router = express.Router();
const ArtWork = require("../Model/ArtWork");


router.create("/create/artwork", 
passport.authenticate("jwt", {session: false}),
(req, res) => {
    artStorage(req, res, async (err) => {
        if (err) {
            return res.json({ err: "Failed to upload files"});
        }

        try {

            const { title, size, medium, surface, artType, creationYear, quality, delivery, description, price} = req.body;

            const artPhoto = req.files.artPhoto
            const userId = req.user._id;

            const newArtwork = new ArtWork({
                title,
                size,
                medium,
                surface,
                artType,
                creationYear,
                quality,
                delivery,
                description,
                price,
                artPhoto: artPhoto.map(image => image.filename),
                userId,
            });

            await newArtwork.save();

            res.json({ message: 'Artwork created successfully' });

        } catch(error){
            console.error("Error creating artwork", error);
            return res.json({ error: "Error creating artwork"});
        }
    })
})