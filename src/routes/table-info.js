const express = require("express");
const router = express.Router();
const UserGames = require("../models/UserGames");
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
 * Retrieves corresponding user table/video game data from MongoDB.
 */
router.get("/", verifyToken, (req, res, next) => {
    UserGames.findOne({
        userID: JSON.parse(req.query.userID),
    },
    (err, usergames) => {
        if(err) 
            return res.send(JSON.stringify(err));
        else if(!usergames)
            return res.status(400).send(JSON.stringify("No data"));
        else {
            res.send(usergames);
        }
    })
});

/**
 * Logic for adding an object in the corresponding user document's games array. userID is used to find the correct document.
 * Combination of $pull and req.query.videoGameID is used to find the correct object to delete. 200 Status is sent if successful, otherwise status 500.
 */
router.post("/addgame", verifyToken, (req, res, next) => {
    UserGames.findOneAndUpdate(
        {userID: JSON.parse(req.body.userID)},
        {$push: {games: req.body.newGame}},
        {upsert: true, new: true} 
    ).then((result, err) => {
        if(err) {
            return res.status(500).send(JSON.stringify("Error when trying to locate ID or userID associated with object."));
        }
        if(result) {
            return res.status(200).send(JSON.stringify("New game successfully added."));
        }
    })
});

/**
 * Logic for deleting an object in the corresponding user document's games array. userID is used to find the correct document.
 * Combination of $pull and req.query.videoGameID is used to find the correct object to delete. 200 Status is sent if successful, otherwise status 500.
 */
router.delete("/deletegame", verifyToken, (req, res, next) => {
    UserGames.findOneAndUpdate(
        {userID: JSON.parse(req.query.userID)},
        {$pull: {games: {id: req.query.videoGameID}}}, 
        {new: true} 
    ).then((result, err) => {
        if(err) {
            return res.status(500).send(JSON.stringify("Error when trying to locate ID or userID associated with object."));
        }
        if(result) {
            return res.status(200).send(JSON.stringify("Game successfully deleted."));
        }
    })
});

/**
 * Logic for editing a value within an object in the corresponding user document's games array. userID is used to find the correct document.
 * Combination of $set and games.id is used to find the correct object in order to update. The corresponding object property is set through 
 * use of [headerToBeUpdated]. 200 Status is sent if successful, otherwise status 500.
 */
router.put("/editgame", verifyToken, (req, res, next) => {
    let headerToBeUpdated = "games.$." + req.body.header;
    UserGames.findOneAndUpdate({
        userID: JSON.parse(req.body.userID),
        "games.id": req.body.id
    }, {
        $set: {
            [headerToBeUpdated]: req.body.value
        }
    },
    ).then((result, err) => {
        if(err) {
            return res.status(500).send(JSON.stringify("Error when trying to locate ID or userID associated with object."));
        }
        if(result) {
            return res.status(200).send(JSON.stringify("Game successfully updated."));
        }
    })
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