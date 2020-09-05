const { Record, User, Prescription, Doctor } = require("../models");
const prescription = require("../models/prescription");

/*Add prescription to our records database*/
const addPrescription = async (req, res) => {
  const prescription = [];
  const { email } = req.body;
  const patient = await User.findOne({ email });
  if (!patient) {
    return res.status(400).json({ msg: "Patient not found!" });
  }
  const patientId = patient.id;
  const doctor = await Doctor.findById(req.user.id);
  //console.log(doctor);
  //console.log(doctor.patients);
  const index = doctor.patients.find((id) => String(patientId) === String(id));
  console.log(index);
  if (index === undefined) {
    doctor.patients.push(patientId);
  }
  await doctor.save();
  let record = await Record.findOne({ patient: patientId });
  if (!record) {
    const newPrescription = new Prescription({
      date: req.body.date,
      weight: req.body.weight,
      symptoms: req.body.symptoms,
      medicines: req.body.medicines,
      doctor: req.user.id,
      patient: patientId,
    });
    await newPrescription.save();
    prescription.push(newPrescription.id);
    const newRecord = new Record({
      patient: patientId,
      patientEmail: req.body.email,
      prescriptions: prescription,
    });
    await newRecord.save();
    res.status(200).json(newRecord);
  } else {
    const newPrescription = new Prescription({
      date: req.body.date,
      weight: req.body.weight,
      symptoms: req.body.symptoms,
      medicines: req.body.medicines,
      doctor: req.user.id,
      patient: patientId,
    });
    await newPrescription.save();
    const record = await Record.findOne({ patient: patientId });
    //console.log(record);
    record.prescriptions.push(newPrescription.id);
    await record.save();
    res.status(200).json({ record });
  }
};
/*Get all records of patient for himself*/
const getRecord = async (req, res) => {
  const patient = req.user.id;
  const record = await Record.findOne({ patient }).populate("prescriptions");
  if (!record) {
    res.status(400).json({ msg: "You dont have any previous records" });
  }
  res.status(200).json({ record });
};

/*Get all records of patient for a doctor*/
const getRecordsForDoctor = async (req, res) => {
  const { email } = req.body;
  const record = await Record.findOne({ patientEmail: email }).populate(
    "prescriptions"
  );
  console.log(record);
  if (!record) {
    return res.status(400).json({ msg: "No record found for this email" });
  }
  // console.log(req.user.id);
  const records = [];
  record.prescriptions.map((prescription) => {
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

/*Update any prescription*/
const updatePrescription = async (req, res) => {
  try {
    console.log(req.body.medicines);
    const id = req.params.id;
    const result = await Prescription.findById(id);
    if (!result) {
      return res.status(404).json({ msg: "Prescription not found!" });
    }
    console.log(result.doctor);
    console.log(result.patient);
    console.log(req.user.id);
    if (
      String(result.patient) === String(req.user.id) ||
      String(result.doctor) === String(req.user.id)
    ) {
      console.log("Hello");
      const response = await Prescription.findByIdAndUpdate(
        id,
        {
          date: req.body.date,
          weight: req.body.weight,
          symptoms: req.body.symptoms,
          medicines: req.body.medicines,
        },
        { new: true }
      );
      return res.status(200).json(response);
    }
    return res
      .status(403)
      .json({ msg: "Not authorized to update prescription" });
  } catch (e) {
    return res.status(400).json({ msg: "Internal server error" });
  }
};
const deletePrescription = async (req, res) => {
  try {
    const id = req.params.id;
    let response = await Prescription.findById(id);
    console.log(response);
    if (String(req.user.id) !== String(response.doctor)) {
      res.status(403).json({ msg: "Not Authorized to delete prescription" });
    }
    response = await Prescription.findByIdAndDelete(id);
    const record = await Record.findOne({ patient: response.patient });
    const index = record.prescriptions.indexOf(record.id);
    record.prescriptions.splice(index, 1);
    await record.save();
    return res.status(200).json({ record });
  } catch (e) {
    console.log(e.message);
    return res.status(404).json({ msg: "internal Server error" });
  }
};
// Get all patients of a specific doctor
const getAllPatientsOfASpecificDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.user.id).populate("patients");
  //console.log(doctor);
  if (!doctor) {
    return res.status(404).json({ msg: "Doctor not found!" });
  }
  const { patients } = doctor;

  return res.status(200).json({ patients });
};

module.exports = {
  addPrescription,
  getRecord,
  getRecordsForDoctor,
  updatePrescription,
  deletePrescription,
  getAllPatientsOfASpecificDoctor,
};
