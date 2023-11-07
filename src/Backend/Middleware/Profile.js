const multer = require("multer");
const path = require("path");



const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profilePic"){
            cb(null, path.join(__dirname, "../../../public/ProfilePic" ));
        } else {
            cb(new Error("Invalid fieldname"),null);
        }
    }, fieldname: (req, file, cb) => {
        const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, uniquePrefix + extension);
    }
});


exports.profilePicUploads = multer({storage: profileStorage}).fields([
    {name: "profilePic", maxCount: 1},
]);