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
      patientEmail: email,
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
const getRecord = async (req, res) => {
  const patient = req.user.id;
  const record = await Record.findOne({ patient });
  if (!record) {
    res.status(400).json({ msg: "You dont have any previous records" });
  }
  const { prescription } = record;
  res.status(200).json({ prescription });
};
const getRecordsForDoctor = async (req, res) => {
  const { email } = req.body;
  const record = await Record.findOne({ patientEmail: email });
  if (!record) {
    return res.status(400).json({ msg: "No record found for this email" });
  }
  // console.log(req.user.id);
  const records = [];
  record.prescription.map((prescription) => {
    // console.log(prescription.doctor);
    if (String(prescription.doctor) === String(req.user.id)) {
      records.push(prescription);
    }
  });
  if (records.length === 0) {
    return res
      .status(400)
      .json({ msg: "No prescriptions present for this doctor" });
  }
  res.status(200).json({ records });
};
module.exports = {
  addPrescription,
  getRecord,
  getRecordsForDoctor,
};
