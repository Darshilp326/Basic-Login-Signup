const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  prescription: [
    {
      name: String,
      numberOfDays: Number,
      Date: {
        type: Date,
        default: Date.now,
      },
      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    },
  ],
});
module.exports = mongoose.model("Record", recordSchema);
