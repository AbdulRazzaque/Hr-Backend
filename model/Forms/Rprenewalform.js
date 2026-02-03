const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const rprenewalformSchema = new Schema({
    //New Employee Info
    employeeId:{type:Schema.Types.ObjectId,ref:"NewEmployee"},
    date: { type: Date, require: true },
    //new visa
 
    healthCard: { type: String, require: true },
    RPRenewalRequested: { type: String, require: true },
    exitPermitRequested: { type: String, require: true },
    OthersRequested: { type: String, require: true },
    comment: { type: String, require: true },

},{timestamps:true, toJSON:{getters:true}})

module.exports = mongoose.model("Rprenewalform", rprenewalformSchema, "rprenewalforms");
