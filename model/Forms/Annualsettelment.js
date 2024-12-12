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
    leaveStartDate: { type: Date, require: true },

    resumingVacation: { type: Date, require: true },

  },
  { timestamps: true, toJSON: { getters: true } }
);

module.exports = mongoose.model(
  "Annualsettelment",
  annualsettelmentSchema,
  "annualsettelments"
);
