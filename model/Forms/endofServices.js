
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const endofServicesSchema = new Schema(
  {
    //-----------endofServicesSchema---------------------
    employeeId:{type:Schema.Types.ObjectId,ref:"NewEmployee"},
    date: { type: Date, require: true },
    subject: { type: String},
    exitType:{type:String,require:true},
    lastWorkingDate: { type: Date, require: true },
    dateOfJoining: { type: Date, require: true },
    resumingofLastVacation: { type: Date, require: true },
    other: { type: String },
 

  },
  { timestamps: true, toJSON: { getters: true }}
);

module.exports = mongoose.model(
  "EndofService",
  endofServicesSchema,
  "endofServices"
);
