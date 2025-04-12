const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const newEmployeeSchema = new Schema(
  {
    // New Employee Info
    name: { type: String,  },
    arabicName: { type: String,  },
    dateOfBirth: { type: Date,  },
    dateOfJoining: { type: Date,  },
    mobileNumber: { type: String,  }, // Change to String for phone number format
    maritalStatus: { type: String,  },
    nationality: { type: String,  },
    department: { type: String,  },

    // Probation Period
    probationMonthofNumber: { type: Number,  },
    probationDate: { type: Date,  },
    probationAmount: { type: Number,  },

    // Salary Details
    BasicSalary: { type: Number,  },
    HousingAmount: { type: Number,  },
    transportationAmount: { type: Number,  },
    otherAmount: { type: Number,  },
    visaType: { type: String,  },

    // Qatar ID Details
    qatarID: { type: String, },  // Change to String for Qatar ID
    qatarIdExpiry: { type: Date,},
    idDesignation: { type: String, },  // Change to String for Qatar ID

    // Passport Details
    passportNumber: { type: String,  },
    passportDateOfIssue: { type: Date,  },
    passportDateOfExpiry: { type: Date,  },

    // HR Purpose
    employeeNumber: { type: String,  },
    position: { type: String,  },
    status: { type: String, default: 'Active' },
    salaryIncrement:[
      {
        salaryIncrementAmount:{type:Number},
        salaryIncrementDate:{type:Date},
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

module.exports = mongoose.model("NewEmployee", newEmployeeSchema, "newEmployees");
