const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const newEmployeeSchema = new Schema(
  {
    // New Employee Info
    name: { type: String, trim: true },
    arabicName: { type: String, trim: true },
    dateOfBirth: { type: Date, },
    dateOfJoining: { type: Date, },
    mobileNumber: { type: String, trim: true }, // Change to String for phone number format
    maritalStatus: { type: String, trim: true },
    nationality: { type: String, },
    department: { type: String, },

    // Probation Period
    probationMonthofNumber: { type: Number, },
    probationDate: { type: Date, },
    probationAmount: { type: Number, trim: true },

    // Salary Details
    BasicSalary: { type: Number, },
    HousingAmount: { type: Number, },
    transportationAmount: { type: Number, },
    otherAmount: { type: Number, },
    visaType: { type: String, },

    // Qatar ID Details
    qatarID: {
      type: String,
      trim: true,
      lowercase: true,
      index: {
        unique: true,
        partialFilterExpression: { qatarID: { $type: "string", $gt: "" } }
      }
    },  // Change to String for Qatar ID
    qatarIdExpiry: { type: Date },
    idDesignation: { type: String, trim: true },  // Change to String for Qatar ID

    // Passport Details
    passportNumber: {
      type: String,
      trim: true,
      uppercase: true,
      index: {
        unique: true,
        partialFilterExpression: { passportNumber: { $type: "string", $gt: "" } }
      }
    },
    passportDateOfIssue: { type: Date },
    passportDateOfExpiry: { type: Date },

    // HR Purpose
    employeeNumber: {
      type: String,
      trim: true,
      lowercase: true,
      index: {
        unique: true,
        partialFilterExpression: { employeeNumber: { $type: "string", $gt: "" } }
      }
    },
    position: { type: String, trim: true },
    status: { type: String, default: 'Active' },
    salaryIncrement: [
      {
        salaryIncrementAmount: { type: Number },
        salaryIncrementDate: { type: Date },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      }
    ],
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

const NewEmployee = mongoose.model("NewEmployee", newEmployeeSchema, "newEmployees");

// 🔹 Auto-drop old standard unique indexes and rebuild partial unique indexes
const dropAndSyncIndexes = async () => {
  try {
    const collection = mongoose.connection.collection("newEmployees");
    const indexes = await collection.indexes();
    for (const index of indexes) {
      if (
        ["qatarID_1", "passportNumber_1", "employeeNumber_1"].includes(index.name) &&
        !index.partialFilterExpression
      ) {
        await collection.dropIndex(index.name);
        console.log(`✅ Dropped old non-partial index: ${index.name}`);
      }
    }
    await NewEmployee.syncIndexes();
    console.log("✅ Successfully synced partial unique indexes for newEmployees.");
  } catch (err) {
    // Ignore if collection doesn't exist yet
  }
};

if (mongoose.connection.readyState === 1) {
  dropAndSyncIndexes();
} else {
  mongoose.connection.once("connected", dropAndSyncIndexes);
}

module.exports = NewEmployee;
