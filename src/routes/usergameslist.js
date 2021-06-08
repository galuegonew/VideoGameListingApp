const express = require("express");
const router = express.Router();
const UserGames = require("../models/UserGames");

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
     );
    next();
});

/**
 *  Creates a UserGames list at a given id
 */
router.post("/", (req, res, next) => {
    const newObj = req.body;
    const createObj = {
        userID: newObj.userID,
        games: []
    }
    UserGames.create(createObj).then((customer) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(JSON.stringify("Games List Created for User!"))
    }).catch(next);
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