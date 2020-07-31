const { Record, User } = require("../models");

const addPrescription = async (req, res) => {
  const { email } = req.body;
  const patient = await User.findOne({ email });
  if (!patient) {
    return res.status(400).json({ msg: "Patient not found!" });
  }
  const patientId = patient.id;
  let record = await Record.findOne({ patient: patientId });
  if (!record) {
    const newRecord = new Record({
      patient: patientId,
    });
    await newRecord.save();
  }

  record = await Record.findOne({ patient: patientId });
  console.log(record);
  record.prescription.push({
    name: req.body.name,
    numberOfDays: req.body.numberOfDays,
    doctor: req.user.id,
    symptoms: req.body.symptoms,
    weight: req.body.weight,
  });
  await record.save();
  res.status(200).json(record);
};
const getPrescription = async (req, res) => {
  const patient = req.user.id;
  const record = Record.findOne({ patient });
  if (!record) {
    res.status(400).json({ msg: "You dont have any previous records" });
  }
  const { prescription } = record;
  res.status(200).json({ prescription });
};
module.exports = {
  addPrescription,
  getPrescription,
};
