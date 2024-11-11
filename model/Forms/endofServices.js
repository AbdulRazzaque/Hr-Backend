
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const endofServicesSchema = new Schema(
  {
    //-----------endofServicesSchema---------------------
    employeeId:{type:Schema.Types.ObjectId,ref:"NewEmployee"},
    date: { type: Date, require: true },
    subject: { type: String, require: true },
    exitType:{type:String,require:true},
    lastWorkingDate: { type: String, require: true },
    dateOfJoining: { type: Date, require: true },
    resumingofLastVacation: { type: Date, require: true },
    other: { type: String, require: true },
    //---------------Prepared-----------------------
    preparedName: { type: String, require: true },
    preparedDate: { type: Date, require: true },
    //-----------------HR--------------------
    hrName: { type: String, require: true },
    hrDate: { type: Date, require: true },
    //--------------------Diretor------------------
    directorName: { type: String, require: true },
    directorDate: { type: Date, require: true },
  },
  { timestamps: true, toJSON: { getters: true }}
);

module.exports = mongoose.model(
  "EndofService",
  endofServicesSchema,
  "endofServices"
);
