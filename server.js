/**
 * Logic for initializing express, conntecting to the correct mongodb cluster and database, parsing configuration,
 * accepting JSOIN data, initializing routes, and port listening.
 */
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

const CONNECTION_URI = "mongodb+srv://Albert:Password123123@csci3230u.egjgj.mongodb.net/csci3230u?retryWrites=true"

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

mongoose.connect(CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.Promise = global.Promise;

app.use(express.json());

app.use("/api/login", require("./src/routes/login"));
app.use("/api/register", require("./src/routes/register"));
app.use("/api/videogamelisting", require("./src/routes/videogamelisting"));
app.use("/api/moreinfo", require("./src/routes/moreinfo"));
app.use("/api/videogameimages", require("./src/routes/videogameimages"));
app.use("/api/usersgameslisting", require("./src/routes/table-info"));
app.use("/api/checkuser", require("./src/routes/checkuser"));
app.use("/api/usergameslist", require("./src/routes/usergameslist"));

app.use(function (err, req, res, next) {
  res.status(422).send({ error: err.message });
});

app.use(express.static("build"));

app.listen(process.env.PORT || 3000, function () {
  console.log("now listening for requests on port 3000");
});