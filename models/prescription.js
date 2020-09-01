const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  Date: {
    type: Date,
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
