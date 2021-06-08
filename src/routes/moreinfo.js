const express = require("express");
const router = express.Router();
const VideoGame = require("../models/VideoGame");
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

router.post("/", verifyToken, (req, res, next) => {
    VideoGame.findOne({name: req.body.gameName}, (err, videogames) => {
            if(err) {
                return res.send(JSON.stringify(err));
            }
            else if(!videogames) {
                return res.status(400).send(JSON.stringify("No data"));
            }
            else {
                res.status(200).send(videogames);
            }
        }
    )
});

router.post("/gameimage", verifyToken, (req, res, next) => {
    VideoGameImages.findOne({steam_appid : req.body.gameAppID
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