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
 * Check if user credentials exist in database. If so, user is assigned a JSON web token that the user uses in order to make other API requests
 * such as editing, deleting, adding to table, and more. If not, status 400 is sent.
 */
router.post("/", (req, res, next) => {
    let returnObj = {
      id: "",
      token: "",
    }
    User.findOne({
        Username: req.body.Username,
        Password: req.body.Password,
      },
      (err, user) => {
        if (err) {
          res.send(JSON.stringify(err));
        }
        if (!user) {
          return res.status(400).send(JSON.stringify("Credentials do not exist in MongoDB"));
        } else {
          const token = jwt.sign({ _id: user._id }, "dasdsadasdsasddas");
          res.setHeader("Content-Type", "application/json");
          returnObj.id = user._id;
          returnObj.token = token;
          return res.status(200).send(JSON.stringify(returnObj));
        }
      });
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