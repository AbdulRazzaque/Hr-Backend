const mongoose = require("mongoose");

const Schema = mongoose.Schema;
 
const AbsenceLeaveSchema = new Schema({
    employeeId:{type:Schema.Types.ObjectId,ref:"NewEmployee"},
    date:{type:Date,require:true},
    leaveType:{type:String,require:true},
    leaveStartDate:{type:Date},
    leaveEndDate:{type:Date}, 
    totalSickLeaveDays:{type:Number},
    AbsenceLeaveStartDate:{type:Date},
    AbsenceLeaveEndDate:{type:Date}, 
    totalAbsenceLeaveDays:{type:Number},
    comment:{type:String}
},{timestamps:true,toJSON:{getters:true}})


module.exports = mongoose.model("AbsenceLeave",AbsenceLeaveSchema,"absenceLeave")