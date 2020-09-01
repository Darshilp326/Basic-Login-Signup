const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  Date: {
    type: String,
  },
  weight: {
    type: Number,
  },
  symptoms: {
    type: String,
  },
  medicines: [
    {
      name: String,
      dosage: String,
      numberOfDays: Number,
    },
  ],
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
});
module.exports = mongoose.model("Prescription", prescriptionSchema);
