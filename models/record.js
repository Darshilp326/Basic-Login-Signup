const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  patientEmail: {
    type: String,
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
      symptoms: {
        type: String,
      },
      weight: {
        type: Number,
      },
    },
  ],
});
module.exports = mongoose.model("Record", recordSchema);
