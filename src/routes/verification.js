const jwt = require("jsonwebtoken");

/**
 * Requests headers for auth-token and verifies that its value
 * is a valid JWT token. Otherwise a 400 response is returned.
 */
module.exports = function (req, res, next) {
  const token = JSON.parse(req.header("token"));
  if (!token) { 
      return res.status(401).send("Access Denied");
  } else {
    try {
      const verified = jwt.verify(token, "dasdsadasdsasddas");
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).send("Invalid Token");
    }
  }
};
