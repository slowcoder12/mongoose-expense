const mongoose = require("mongoose");

const fileDownloadsSchema = mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const fileDownloads = mongoose.model("filedownlod", fileDownloadsSchema);

module.exports = fileDownloads;
