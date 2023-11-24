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

            const { title, category, size, medium, surface, artType, creationYear, quality, delivery, description, price} = req.body;

            const artPhoto = req.files.artPhoto.map((photo) => photo.path);
            const userId = req.user._id;

            const newArtwork = new ArtWork({
                title,
                category,
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
                size: artwork.size,
                medium: artwork.medium,
                surface: artwork.surface,
                artType: artwork.artType,
                creationYear: artwork.creationYear,
                quality: artwork.quality,
                delivery: artwork.delivery,
                description: artwork.description,
            };
        })

          res.json({ data: simplifiedArtwork });

    } catch (error) {
        console.log('Error getting all artworks', error);
        return res.json({ error: "Error Fetching all the artworks"});
    }
});


router.get("/alldrawings",
passport.authenticate("jwt", {session: false}),
async(req, res) => {
    try{
        const categoryRegex = /Drawings/i;

        const artworks = await ArtWork.find({ category: categoryRegex });

        if(!artworks){
            return res.json({ error: "Artwork not found" })
        };

        const simplifiedArtwork = artworks.map(artwork => {
            
            const firstPhoto = artwork.artPhoto[0] || null;

            return {
                _id: artwork._id,
                title: artwork.title,
                price: artwork.price,
                artPhoto: firstPhoto.replace("../../../public", ""),
                size: artwork.size,
                medium: artwork.medium,
                surface: artwork.surface,
                artType: artwork.artType,
                creationYear: artwork.creationYear,
                quality: artwork.quality,
                delivery: artwork.delivery,
                description: artwork.description,
            };
        })

          res.json({ data: simplifiedArtwork });


    } catch (error){
        console.log("Error fetching all the artwork which are drawn", error);
        return res.json({ error: "Error fetching drawn artwork" });
    }
});

router.get("/allpaintings",
passport.authenticate("jwt", {session: false}),
async(req, res) => {
    try{
        const categoryRegex = /Paintings/i;

        const artworks = await ArtWork.find({ category: categoryRegex });

        if(!artworks){
            return res.json({ error: "Artwork not found" })
        };

        const simplifiedArtwork = artworks.map(artwork => {
            
            const firstPhoto = artwork.artPhoto[0] || null;

            return {
                _id: artwork._id,
                title: artwork.title,
                price: artwork.price,
                artPhoto: firstPhoto.replace("../../../public", ""),
                size: artwork.size,
                medium: artwork.medium,
                surface: artwork.surface,
                artType: artwork.artType,
                creationYear: artwork.creationYear,
                quality: artwork.quality,
                delivery: artwork.delivery,
                description: artwork.description,
            };
        })

          res.json({ data: simplifiedArtwork });


    } catch (error){
        console.log("Error fetching all the artwork which are drawn", error);
        return res.json({ error: "Error fetching drawn artwork" });
    }
});



router.get("/get/artwork/:title",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const title = req.params.title;

        const artwork = await ArtWork.findOne({title});

        if(!artwork){
            return res.json({ error: "Artwork not found" })
        }

        const updatedArtPhotos = artwork.artPhoto.map(photo => photo.replace("../../../public", ""));

        const artWorkData = {
            _id: artwork._id,
            title: artwork.title,
            artPhoto: updatedArtPhotos,
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

        res.json({ data : artWorkData });

    } catch (error){
        console.error("Error fetching the artwork", error);
        return res.json({ error: "Error fetching the artwork"});
    }
});


router.get("/medium",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const mediumCounts = await ArtWork.aggregate([
            {
              $group: {
                _id: "$medium",
                count: { $sum: 1 }
              }
            },
            {
              $project: {
                medium: "$_id",
                count: 1,
                _id: 0
              }
            }
          ]);
    
          return res.json({ data: mediumCounts });

    } catch (error){
        console.error("Error fetching all the different types of medium in artWork", error);
        return res.json({ error: "Error fetching different types of medium in the artworks" });
    }
});


router.get("/surface",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const surfaceCounts = await ArtWork.aggregate([
            {
              $group: {
                _id: "$surface",
                count: { $sum: 1 }
              }
            },
            {
              $project: {
                surface: "$_id",
                count: 1,
                _id: 0
              }
            }
          ]);
    
          return res.json({ data: surfaceCounts });

    } catch (error){
        console.error("Error fetching all the different types of surface used in the artwork", error);
        return res.json({ error: "Error fetching different types of surfaces used in the artworks" });
    }
});

router.get("/get/medium",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const selectedMedium = req.query.medium;

        const artWork = await ArtWork.find({ medium: selectedMedium });

        
        const simplifiedArtwork = artWork.map(artwork => {
            
            const firstPhoto = artwork.artPhoto[0] || null;

            return {
                _id: artwork._id,
                title: artwork.title,
                price: artwork.price,
                artPhoto: firstPhoto.replace("../../../public", ""),
                size: artwork.size,
                medium: artwork.medium,
                surface: artwork.surface,
                artType: artwork.artType,
                creationYear: artwork.creationYear,
                quality: artwork.quality,
                delivery: artwork.delivery,
                description: artwork.description,
            };
        })


        return res.json({ data: simplifiedArtwork })

    } catch (error){
        console.error("Error fetching the specific type of medium", error);
        return res.json({ error: "Error fetching the specific type of medium"});
    }
});

module.exports = router;