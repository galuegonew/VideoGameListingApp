const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
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
 * Queries the database for a user that has 
 * the same username returns as error if that exists
 * otherwise returns 200 if there is no user that
 * shares a username
 */

router.post("/", (req, res, next) => {
    User.findOne({
        Username: req.body.Username,
      },
      (err, user) => {
        if (err) {
          res.send(JSON.stringify(err));
        }
        if (user) {
          return res.status(400).send(JSON.stringify("Credentials exist in MongoDB"));
        } else {
          res.setHeader("Content-Type", "application/json");
          return res.status(200).send(JSON.stringify("Credentials do not exist in MongoDB"));
        }
      });
});

//Handles CORS preflight requests
router.options("/", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    res.send("OK!");
});

module.exports = router;