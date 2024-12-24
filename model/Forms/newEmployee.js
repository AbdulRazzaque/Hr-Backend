const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const newEmployeeSchema = new Schema(
  {
    // New Employee Info
    name: { type: String, required: true },
    arabicName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    dateOfJoining: { type: Date, required: true },
    mobileNumber: { type: String, required: true }, // Change to String for phone number format
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
    qatarID: { type: String, required: false },  // Change to String for Qatar ID
    qatarIdExpiry: { type: Date, required: false },

    // Passport Details
    passportNumber: { type: String, required: true },
    passportDateOfIssue: { type: Date, required: true },
    passportDateOfExpiry: { type: Date, required: true },

    // HR Purpose
    employeeNumber: { type: String, required: true },
    position: { type: String, required: true },
    status: { type: String, default: 'Active' },
// kk
    employeeImage: {
      type: String,
      get: (employeeImage) => {
        return employeeImage ? `${process.env.APP_URL}/${employeeImage}` : null;
      },
      set: (employeeImage) => {
        if (employeeImage && employeeImage.startsWith(`${process.env.APP_URL}/`)) {
          return employeeImage.replace(`${process.env.APP_URL}/`, '');
        }
        return employeeImage;
      },
    },

    employeePassport: {
      type: String,
      get: (employeePassport) => {
        return employeePassport ? `${process.env.APP_URL}/${employeePassport}` : null;
      },
      set: (employeePassport) => {
        if (employeePassport && employeePassport.startsWith(`${process.env.APP_URL}/`)) {
          return employeePassport.replace(`${process.env.APP_URL}/`, '');
        }
        return employeePassport;
      },
    },

    employeeQatarID: {
      type: String,
      get: (employeeQatarID) => {
        return employeeQatarID ? `${process.env.APP_URL}/${employeeQatarID}` : null;
      },
      set: (employeeQatarID) => {
        if (employeeQatarID && employeeQatarID.startsWith(`${process.env.APP_URL}/`)) {
          return employeeQatarID.replace(`${process.env.APP_URL}/`, '');
        }
        return employeeQatarID;
      },
    },

    employeeContractCopy: {
      type: String,
      get: (employeeContractCopy) => {
        return employeeContractCopy ? `${process.env.APP_URL}/${employeeContractCopy}` : null;
      },
      set: (employeeContractCopy) => {
        if (employeeContractCopy && employeeContractCopy.startsWith(`${process.env.APP_URL}/`)) {
          return employeeContractCopy.replace(`${process.env.APP_URL}/`, '');
        }
        return employeeContractCopy;
      },
    },

    employeeGraduationCertificate: {
      type: String,
      get: (employeeGraduationCertificate) => {
        return employeeGraduationCertificate ? `${process.env.APP_URL}/${employeeGraduationCertificate}` : null;
      },
      set: (employeeGraduationCertificate) => {
        if (
          employeeGraduationCertificate &&
          employeeGraduationCertificate.startsWith(`${process.env.APP_URL}/`)
        ) {
          return employeeGraduationCertificate.replace(`${process.env.APP_URL}/`, '');
        }
        return employeeGraduationCertificate;
      },
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

module.exports = mongoose.model("NewEmployee", newEmployeeSchema, "newEmployees");
