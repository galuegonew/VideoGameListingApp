const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
     );
    next();
});

/**
 * Logic for adding a new user document to corresponding MongoDB collection "users"
 */
router.post("/", (req, res, next) => {
    User.create(req.body)
        .then((customer) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(customer._id))
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