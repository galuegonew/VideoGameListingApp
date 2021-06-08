const mongoose = require("mongoose");
const Schema = mongoose.Schema; // object use to create Schemas

const VideoGameSchema = new Schema({
  appid: {
    type: String,
    required: [true, "Appid field is required"],
    unique: true
  },
  name: {
    type: String,
    required: [true, "Name field is required"],
  },
  release_date: {
    type: String,
    required: [true, "Release_Date field is required"],
  },
  english: {
    type: String,
    required: [true, "English field is required"],
  },
  developer: {
    type: String,
    required: [true, "Developer field is required"],
  },
  publisher: {
    type: String,
    required: [true, "Publisher field is required"],
  },
  required_age: {
    type: String,
    required: [true, "Required_Age field is required"],
  },
  categories: {
    type: String,
    required: [true, "Categories field is required"],
  },
  genres: {
    type: String,
    required: [true, "Genres field is required"],
  },
  steamspy_tags: {
    type: String,
    required: [true, "Streamspy_Tags field is required"],
  },
  achievements: {
    type: String,
    required: [true, "Achievements field is required"],
  },
  positive_ratings: {
    type: String,
    required: [true, "Positive_Ratings field is required"],
  },
  negative_ratings: {
    type: String,
    required: [true, "Negative_Ratings field is required"],
  },
  average_playtime: {
    type: String,
    required: [true, "Average_Playtime field is required"],
  },
  median_playtime: {
    type: String,
    required: [true, "Median_Playtime field is required"],
  },
  owners: {
    type: String,
    required: [true, "Owners field is required"],
  },
  price: {
    type: String,
    required: [true, "Price field is required"],
  },
});

const VideoGame = mongoose.model("videogames", VideoGameSchema);

module.exports = VideoGame;