const multer = require("multer");
const path = require("path");


const artStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "artPhoto"){
            cb(null, path.join(__dirname, "../../../public/ArtImages"));
        } else {
            cb(new Error("Invalid fieldname"), null);
        }
    },
    filename: (req, file, cb) => {
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, uniquePrefix + extension);
    }
});

exports.artUploads = multer({ storage: artStorage}).fields([
    {name: "artPhoto", maxCount: 10},
]);
