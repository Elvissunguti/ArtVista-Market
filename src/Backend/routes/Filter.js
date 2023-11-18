const express = require("express");
const passport = require("passport");
const ArtWork = require("../Model/ArtWork");
const User = require("../Model/User");
const router = express.Router();


router.get("/all",
passport.authenticate("jwt", {session: false}),
async (req, res) => {
    try{
        const { userName, medium, surface } = req.query;

        if (userName) {
          const user = await User.findOne({ userName });
  
          if (!user) {
            return res.json({ error: "User not found" });
          }
  
          // Use the found userId to fetch artworks by the user
          const userArtwork = await ArtWork.find({ userId: user._id });

            // Extract unique medium and surface values along with counts
            const mediumCounts = {};
            const surfaceCounts = {};

            userArtwork.forEach((artwork) => {
                // Count medium occurrences
                if (artwork.medium) {
                    mediumCounts[artwork.medium] = (mediumCounts[artwork.medium] || 0) + 1;
                }

                // Count surface occurrences
                if (artwork.surface) {
                    surfaceCounts[artwork.surface] = (surfaceCounts[artwork.surface] || 0) + 1;
                }
            });

            const mediumCountsArray = Object.keys(mediumCounts).map((medium) => ({
                medium,
                count: mediumCounts[medium],
              }));
        
            const surfaceCountsArray = Object.keys(surfaceCounts).map((surface) => ({
                surface,
                count: surfaceCounts[surface],
              }));

            const simplifiedArtwork = userArtwork.map((artwork) => {
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
            });

            return res.json({ data: {
                mediumCounts: mediumCountsArray,
                surfaceCounts: surfaceCountsArray,
                simplifiedArtwork,
            },
            });
        }

        // If userId is not provided, proceed with the original logic to fetch and return artwork
        const filters = {};
        if (medium) filters.medium = medium;
        if (surface) filters.surface = surface;

        const artWork = await ArtWork.find(filters);

        const mediumCounts = {};
        const surfaceCounts = {};

        artWork.forEach((artwork) => {
            // Count medium occurrences
            if (artwork.medium) {
                mediumCounts[artwork.medium] = (mediumCounts[artwork.medium] || 0) + 1;
            }

            // Count surface occurrences
            if (artwork.surface) {
                surfaceCounts[artwork.surface] = (surfaceCounts[artwork.surface] || 0) + 1;
            }
        });

        const mediumCountsArray = Object.keys(mediumCounts).map((medium) => ({
            medium,
            count: mediumCounts[medium],
          }));
    
        const surfaceCountsArray = Object.keys(surfaceCounts).map((surface) => ({
            surface,
            count: surfaceCounts[surface],
          }));

        const simplifiedArtwork = artWork.map((artwork) => {
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
        });

        return res.json({ data: {
            mediumCounts: mediumCountsArray,
            surfaceCounts: surfaceCountsArray,
            simplifiedArtwork,
        },
        });

    } catch(error){
        console.error("Error fetching artwork according to the filters", error);
        return res.json({ error: "Error fetching artwork according to the filter" });
    }
});
module.exports = router;