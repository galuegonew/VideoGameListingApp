const mongoose = require("mongoose");
const Schema = mongoose.Schema; // object use to create Schemas

const VideoGameImagesSchema = new Schema({
  steam_appid: {
    type: String,
    required: [true, "appid field is required"],
    unique: true
  },
  header_image: {
    type: String,
    required: [true, "header_image field is required"],
  },
  screenshots: {
    type: String,
    required: [true, "screenshots field is required"],
  },
  background: {
    type: String,
    required: [true, "background field is required"],
  },
  movies: {
    type: String,
    required: [true, "movies field is required"],
  }
});

const VideoGameImages = mongoose.model("videogameimages", VideoGameImagesSchema);

module.exports = VideoGameImages;