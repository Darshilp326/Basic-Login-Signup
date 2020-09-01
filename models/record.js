const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  patientEmail: {
    type: String,
  },
  prescriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
  ],
});
module.exports = mongoose.model("Record", recordSchema);
