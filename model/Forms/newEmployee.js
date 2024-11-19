
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const newEmployeeSchema = new Schema(
  {
    // New Employee Info
    name: { type: String, required: true },
    arabicName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    dateOfJoining: { type: Date, required: true },
    mobileNumber: { type: Number, required: true },
    maritalStatus: { type: String, required: true },
    nationality: { type: String, required: true },
    department: { type: String, required: true },

    // Probation Period
    probationMonthofNumber: { type: Number, required: true },
    probationDate: { type: Date, required: true },
    probationAmount: { type: Number, required: true },

    // Salary Details
    BasicSalary: { type: Number, required: true },
    HousingAmount: { type: Number, required: true },
    transportationAmount: { type: Number, required: true },
    otherAmount: { type: Number, required: true },
    visaType: { type: String, required: true },

    // Qatar ID Details
    qatarID:{ type: Number,required: false },
    qatarIdExpiry: { type: Date,required: false },

    // Passport Details
    passportNumber: { type: String, required: true },
    passportDateOfIssue: { type: Date, required: true },
    passportDateOfExpiry: { type: Date, required: true },

    // HR Purpose
    employeeNumber: { type: Number, required: true },
    position: { type: String, required: true },
    status: {type: String,default: 'Active'}, 

    // Image fields with URL formatting
    employeeImage: {
      type: String,
      required: true,
      get: (employeeImage) => employeeImage && !employeeImage.startsWith('http') ? `${process.env.APP_URL}/${employeeImage}` : employeeImage
    },
    employeePassport: {
      type: String,
      required: true,
      get: (employeePassport) => employeePassport && !employeePassport.startsWith('http') ? `${process.env.APP_URL}/${employeePassport}` : employeePassport
    },
    employeeQatarID: {
      type: String,
      required: true,
      get: (employeeQatarID) => employeeQatarID && !employeeQatarID.startsWith('http') ? `${process.env.APP_URL}/${employeeQatarID}` : employeeQatarID
    },
    employeeContractCopy: {
      type: String,
      required: true,
      get: (employeeContractCopy) => employeeContractCopy && !employeeContractCopy.startsWith('http') ? `${process.env.APP_URL}/${employeeContractCopy}` : employeeContractCopy
    },
    employeeGraduationCertificate: {
      type: String,
      required: true,
      get: (employeeGraduationCertificate) => employeeGraduationCertificate && !employeeGraduationCertificate.startsWith('http') ? `${process.env.APP_URL}/${employeeGraduationCertificate}` : employeeGraduationCertificate
    }
  },
  { timestamps: true, toJSON: { getters: true } }
);


module.exports = mongoose.model("NewEmployee", newEmployeeSchema, "newEmployees");
