const express = require("express");
const router = express.Router();
const passport = require("passport");
const ArtWork = require("../Model/ArtWork");


router.post("/create", 
passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        try {
            const { title, category, size, medium, surface, artType, creationYear, quality, delivery, description, price} = req.body;

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
                artPhoto: req.body.artPhoto,
                userId,
            });

            await newArtwork.save();

            res.json({ message: "Artwork created successfully" });

        } catch(error){
            console.error("Error creating artwork", error);
            return res.json({ error: "Error creating artwork"});
        }
   
});

//router to fetch all the artwork posted by the current user
router.get("/get/myartworks",
passport.authenticate("jwt", {session: false}),
async(req, res) => {
    try{

        const userId = req.user._id;

        const artWorks = await ArtWork.find({userId});

        if (!artWorks || artWorks.length === 0) {
            return res.json({ message: "No artworks found for the current user" });
          }

          const simplifiedArtwork = artWorks.map(artwork => {
            
            const firstPhoto = artwork.artPhoto[0] || null;

            return {
                _id: artwork._id,
                title: artwork.title,
                price: artwork.price.toLocaleString(),
                artPhoto: firstPhoto,
                isSold: artwork.isSold,

            };
           })

         return res.json({ data: simplifiedArtwork });
        
    }catch (error){
        console.error("Error fetching artwork of the current user:", error);
        return res.json({ error: "error fetching all the artwork posted by the current user"});
    }
})

router.get("/overview",
    async (req, res) => {
        try{
            const randomArtworks = await ArtWork.aggregate([
            { $sample: { size: 6 } } // Fetch 6 random artworks
        ]);

        return res.json({ data: randomArtworks });

        } catch(error){
            console.error("Error fetching artwork for overview", error);
            return res.json({ error: "Error fetching artwork for overvew"});
        }
    }
)

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
                price: artwork.price.toLocaleString(),
                artPhoto: firstPhoto,
                size: artwork.size,
                medium: artwork.medium,
                surface: artwork.surface,
                artType: artwork.artType,
                creationYear: artwork.creationYear,
                quality: artwork.quality,
                delivery: artwork.delivery,
                description: artwork.description,
                isSold: artwork.isSold,
            };
        })

          res.json({ data: simplifiedArtwork });

    } catch (error) {
        console.log("Error getting all artworks", error);
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
                price: artwork.price.toLocaleString(),
                artPhoto: firstPhoto,
                size: artwork.size,
                medium: artwork.medium,
                surface: artwork.surface,
                artType: artwork.artType,
                creationYear: artwork.creationYear,
                quality: artwork.quality,
                delivery: artwork.delivery,
                description: artwork.description,
                isSold: artwork.isSold,
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
                price: artwork.price.toLocaleString(),
                artPhoto: firstPhoto,
                size: artwork.size,
                medium: artwork.medium,
                surface: artwork.surface,
                artType: artwork.artType,
                creationYear: artwork.creationYear,
                quality: artwork.quality,
                delivery: artwork.delivery,
                description: artwork.description,
                isSold: artwork.isSold,
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

        const updatedArtPhotos = artwork.artPhoto.map(photo => photo);

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
            price: artwork.price.toLocaleString(),
            artistId: artwork.userId,
            isSold: artwork.isSold,
        };

        res.json({ data : artWorkData });

    } catch (error){
        console.error("Error fetching the artwork", error);
        return res.json({ error: "Error fetching the artwork"});
    }
});

router.get("/category",
    passport.authenticate("jwt", {session: false}),
    async (req, res) => {
        try{
    
            const categoryCounts = await ArtWork.aggregate([
                {
                  $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                  }
                },
                {
                  $project: {
                    category: "$_id",
                    count: 1,
                    _id: 0
                  }
                }
              ]);
        
              return res.json({ data: categoryCounts });
    
        } catch (error){
            console.error("Error fetching all the different types of category used in the artwork", error);
            return res.json({ error: "Error fetching different types of category used in the artworks" });
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
                price: artwork.price.toLocaleString(),
                artPhoto: firstPhoto,
                size: artwork.size,
                medium: artwork.medium,
                surface: artwork.surface,
                artType: artwork.artType,
                creationYear: artwork.creationYear,
                quality: artwork.quality,
                delivery: artwork.delivery,
                description: artwork.description,
                isSold: artwork.isSold,
            };
        })


        return res.json({ data: simplifiedArtwork })

    } catch (error){
        console.error("Error fetching the specific type of medium", error);
        return res.json({ error: "Error fetching the specific type of medium"});
    }
});

// router to fetch artwork that are similar with the one being currently viewed
router.get("/get/similarArtwork/:title",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{

        const title = req.params.title;

        const currentArtwork = await ArtWork.findOne({ title }).exec();

        
        if (!currentArtwork) {
            return res.json({ error: "Artwork not found" });
        };

        const similarArtwork = await ArtWork.find({
            category: currentArtwork.category,
            $or: [
                { medium: currentArtwork.medium },
                { surface: currentArtwork.surface },
            ],
            _id: { $ne: currentArtwork._id },
        }).limit(5).exec();

        const simplifiedArtwork = similarArtwork.map(artwork => {
            
            const firstPhoto = artwork.artPhoto[0] || null;

            return {
                _id: artwork._id,
                title: artwork.title,
                price: artwork.price.toLocaleString(),
                artPhoto: firstPhoto.replace("../../../public", ""),
                size: artwork.size,
                medium: artwork.medium,
                surface: artwork.surface,
                artType: artwork.artType,
                creationYear: artwork.creationYear,
                quality: artwork.quality,
                delivery: artwork.delivery,
                description: artwork.description,
                isSold: artwork.isSold,
            };
        })

        return res.json({ data: simplifiedArtwork });

    } catch(error){
        console.error("Error Fetching artwok similar to the one being viewed", error);
        return res.json({ error: "Error fetching artwork similar to the one being viewed"});
    }
});


// router to flag off an artwork as sold
router.post("/sold/:artWorkId",
passport.authenticate("jwt", {session: false}),
async(req, res) => {
    try{

        const artWorkId = req.params.artWorkId;


        // Update the artwork as sold and return the updated document
        const updatedArtWork = await ArtWork.findByIdAndUpdate(
            artWorkId,
            { isSold: true },
            { new: true }
        );

        if (!updatedArtWork) {
            return res.status(404).json({ error: "Artwork not found" });
        }

        return res.json({ message: "Artwork marked as sold successfully" });

    } catch (error){
        console.error("couldn't mark the artwork as sold:", error);
        return res.json({ error: "error marking the artwork as sold" });
    }
});

module.exports = router;