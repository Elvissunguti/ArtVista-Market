const mongoose = require("mongoose");

const ArtWork = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    size: {
        type: String,
        required: true,
        unique: false,
    },
    medium: {
        type: String,
        required: true,
        unique: false,
    },
    surface: {
        type: String,
        required: true,
        unique: false,
    },
    artType: {
        type: String,
        required: true,
        unique: false,
    },
    creationYear: {
        type: Number,
        required: true,
        unique: false,
    },
    quality: {
        type: String,
        required: true
    },
    delivery: {
        type: String,
        rerquired: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    artPhoto: {
        type: [String],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

const ArtWorkModel = mongoose.model("Artwork", ArtWork);

module.exports = ArtWorkModel;