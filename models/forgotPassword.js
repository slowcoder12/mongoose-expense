const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forgotPasswordRequestSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isActive: {
    type: Boolean,
  },
});

const forgotPasswordReq = mongoose.model(
  "ForgotPasswordRequest",
  forgotPasswordRequestSchema
);

module.exports = forgotPasswordReq;
