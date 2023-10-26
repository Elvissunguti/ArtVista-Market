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

            const artPhoto = req.files.artPhoto.map((photo) => photo.path);
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
                artPhoto: firstPhoto.replace("../../../public", ""),
            };
        })

          res.json({ data: simplifiedArtwork });

    } catch (error) {
        console.log('Error getting all artworks', error);
        return res.json({ error: "Error Fetching all the artworks"});
    }
});


router.get("/get/artwork/:artWorkId",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const artWorkId = req.params.artWorkId;

        const artwork = await ArtWork.findById(artWorkId);

        if(!artwork){
            return res.json({ error: "Artwork not found" })
        }

        const firstImage = artwork.artPhoto.length > 0 ? artwork.artPhoto[0] : null;

        const artWorkData = {
            _id: artwork._id,
            title: artwork.title,
            artPhoto: firstImage ? firstImage.replace("../../../public", "") : null,
            size: artwork.size,
            medium: artwork.medium,
            surface: artwork.surface,
            artType: artwork.artType,
            creationYear: artwork.creationYear,
            quality: artwork.quality,
            delivery: artwork.delivery,
            description: artwork.description,
            price: artwork.price
        };

        res.json({ data : artWorkData })

    } catch (error){
        console.error("Error fetching the artwork", error);
        return res.json({ error: "Error fetching the artwork"});
    }
})

module.exports = router;