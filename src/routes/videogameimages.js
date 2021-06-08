const express = require("express");
const router = express.Router();
const VideoGameImages = require("../models/VideoGameImages");
const verifyToken = require("./verification");


router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
     );
    next();
});

/**
 * Logic for retrieving all data for images of video games to be stored for a user's session on the front end by way of state data.
 */
router.get("/", verifyToken, (req, res, next) => {
    VideoGameImages.find({
    }, (err, vgImages) => {
            if(err) {
                return res.send(JSON.stringify(err));
            }
            else if(!vgImages) {
                return res.status(400).send(JSON.stringify("No data available"));
            }
            else {
                res.status(200).send(vgImages);
            }
        }
    )
});

/**
 * Handles CORS preflight requests
 */
router.options("/", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    res.send("OK!");
});

module.exports = router;