const mongoose = require("mongoose");

module.exports = mongoose.model(
  "antialts",
  new mongoose.Schema({
    Guild: String,
    Channel: String,
    whitelistedUsers: { default: [], type: [String] },
  })
);
