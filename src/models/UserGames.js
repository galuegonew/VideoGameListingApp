const mongoose = require("mongoose");
const Schema = mongoose.Schema; // object use to create Schemas

const UserGamesSchema = new Schema({
  userID: String,
  games: {
    type: [
    {
      game: String,
      genre: String,
      ranking: Number,
      progress: String,
      rating: Number,
      url: String,
      id: Number,
    },
  ],
}
});
const UserGames = mongoose.model("usersgameslists", UserGamesSchema);

module.exports = UserGames;
