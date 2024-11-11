const express = require("express");
const passport = require("passport");
const ArtWork = require("../Model/ArtWork");
const User = require("../Model/User");
const router = express.Router();


router.get("/all",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      try {
        const { userName, medium, surface, category } = req.query;
  
        if (userName) {
          const user = await User.findOne({ userName });
  
          if (!user) {
            return res.json({ error: "User not found" });
          }
  
          // Fetch artworks by the user and apply the category filter if provided
          const userArtwork = await ArtWork.find({
            userId: user._id,
            ...(category && { category }),
          });
  
          // Extract unique medium, surface, and category values along with counts
          const mediumCounts = {};
          const surfaceCounts = {};
          const categoryCounts = {};
  
          userArtwork.forEach((artwork) => {
            if (artwork.medium) {
              mediumCounts[artwork.medium] = (mediumCounts[artwork.medium] || 0) + 1;
            }
            if (artwork.surface) {
              surfaceCounts[artwork.surface] = (surfaceCounts[artwork.surface] || 0) + 1;
            }
            if (artwork.category) {
              categoryCounts[artwork.category] = (categoryCounts[artwork.category] || 0) + 1;
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
  
          const categoryCountsArray = Object.keys(categoryCounts).map((category) => ({
            category,
            count: categoryCounts[category],
          }));
  
          const simplifiedArtwork = userArtwork.map((artwork) => {
            const firstPhoto = artwork.artPhoto[0] || null;
            return {
              _id: artwork._id,
              title: artwork.title,
              price: artwork.price.toLocaleString(),
              artPhoto: firstPhoto,
              size: artwork.size,
              category: artwork.category,
              medium: artwork.medium,
              surface: artwork.surface,
              artType: artwork.artType,
              creationYear: artwork.creationYear,
              quality: artwork.quality,
              delivery: artwork.delivery,
              description: artwork.description,
              isSold: artwork.isSold,
            };
          });
  
          return res.json({
            data: {
              mediumCounts: mediumCountsArray,
              surfaceCounts: surfaceCountsArray,
              categoryCounts: categoryCountsArray,
              simplifiedArtwork,
            },
          });
        }
  
        // If userName is not provided, proceed with the logic to fetch artwork using filters
        const filters = {};
        if (medium) filters.medium = medium;
        if (surface) filters.surface = surface;
        if (category) filters.category = category;
  
        const artWork = await ArtWork.find(filters);
  
        const mediumCounts = {};
        const surfaceCounts = {};
        const categoryCounts = {};
  
        artWork.forEach((artwork) => {
          if (artwork.medium) {
            mediumCounts[artwork.medium] = (mediumCounts[artwork.medium] || 0) + 1;
          }
          if (artwork.surface) {
            surfaceCounts[artwork.surface] = (surfaceCounts[artwork.surface] || 0) + 1;
          }
          if (artwork.category) {
            categoryCounts[artwork.category] = (categoryCounts[artwork.category] || 0) + 1;
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
  
        const categoryCountsArray = Object.keys(categoryCounts).map((category) => ({
          category,
          count: categoryCounts[category],
        }));
  
        const simplifiedArtwork = artWork.map((artwork) => {
          const firstPhoto = artwork.artPhoto[0] || null;
          return {
            _id: artwork._id,
            title: artwork.title,
            price: artwork.price.toLocaleString(),
            artPhoto: firstPhoto,
            size: artwork.size,
            category: artwork.category,
            medium: artwork.medium,
            surface: artwork.surface,
            artType: artwork.artType,
            creationYear: artwork.creationYear,
            quality: artwork.quality,
            delivery: artwork.delivery,
            description: artwork.description,
            isSold: artwork.isSold,
          };
        });
  
        return res.json({
          data: {
            mediumCounts: mediumCountsArray,
            surfaceCounts: surfaceCountsArray,
            categoryCounts: categoryCountsArray,
            simplifiedArtwork,
          },
        });
      } catch (error) {
        console.error("Error fetching artwork according to the filters", error);
        return res.json({ error: "Error fetching artwork according to the filter" });
      }
    }
  );
  
  module.exports = router;
  


module.exports = router;