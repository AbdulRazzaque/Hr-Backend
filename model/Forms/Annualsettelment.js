const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const annualsettelmentSchema = new Schema(
  {
    //-----------endofServicesSchema---------------------
    employeeId:{type:Schema.Types.ObjectId,ref:"NewEmployee"},
    date: { type: Date, require: true },
    subject: { type: String, require: true },
    to: { type: String, require: true },
    from: { type: String, require: true },
    vacationStartDate: { type: Date, require: true },
    joiningDate: { type: Date, require: true },
    resumingVacation: { type: Date, require: true },

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
  { timestamps: true, toJSON: { getters: true } }
);

module.exports = mongoose.model(
  "Annualsettelment",
  annualsettelmentSchema,
  "annualsettelments"
);
