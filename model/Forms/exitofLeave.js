const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const exitofLeaveSchema = new Schema(
  {
    //-----------endofServicesSchema---------------------
    // Exit Permit Request
     employeeId:{type:Schema.Types.ObjectId,ref:"NewEmployee"},
     date: { type: Date, require: true },
     leaveType: { type: String, require: true },
     leaveStartDate: { type: Date, require: true },
     leaveEndDate: { type: Date, require: true },
     numberOfDayLeave: { type: Number, require: true },
     lastLeaveStartDate: { type: Date, require: true },
     lastLeaveEndDate: { type: Date, require: true },
     lastNumberOfDayLeave: { type: Number, require: true },
     lastLeaveType: { type: String, require: true },
    // Array to track previous leave end dates
    previousLeaveEndDate: { type: Date },
    // Asset and Loan Info
     bankLoan: { type: String, require: true },
     personalLoan: { type: String, require: true },
     CreditCard: { type: String, require: true },
     companyAssetsLoan: { type: String, require: true },
     companyAssets: { type: String, require: true },
     companySimCard: { type: String, require: true },
     companyLaptop: { type: String, require: true },
     tools: { type: String, require: true },
     comment: { type: String },

  },
  { timestamps: true, toJSON: { getters: true } }
);

module.exports = mongoose.model(
  "ExitofLeave",
  exitofLeaveSchema,
  "ExitofLeaves"
);
