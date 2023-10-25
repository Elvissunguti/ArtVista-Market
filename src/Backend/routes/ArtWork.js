const express = require("express");
const router = express.Router();
const passport = require("passport");
const ArtWork = require("../Model/ArtWork");
const { artUploads } = require("../Middleware/Art");


router.post("/create", 
passport.authenticate("jwt", {session: false}),
(req, res) => {
    artUploads(req, res, async (err) => {
        if (err) {
            return res.json({ err: "Failed to upload files"});
        }

        try {

            const { title, size, medium, surface, artType, creationYear, quality, delivery, description, price} = req.body;

            const artPhoto = req.files.artPhoto.map((photo) => photo.filename);
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
                artPhoto: artPhoto,
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

router.get("/get/allartwork",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const allArtwork = await ArtWork.find({});

        if (allArtwork.length === 0) {
            return res.json({ message: "No artwork found." });
          }

          const simplifiedArtwork = allArtwork.map(artwork => {
            
            const firstPhoto = artwork.artPhoto[0] || null;

            return {
                _id: artwork._id,
                title: artwork.title,
                price: artwork.price,
                artPhoto: `../../../public/ArtImages/${firstPhoto}`,
            };
        })

          res.json({ data: simplifiedArtwork });

    } catch (error) {
        console.log('Error getting all artworks', error);
        return res.json({ error: "Error Fetching all the artworks"});
    }
})

module.exports = router;