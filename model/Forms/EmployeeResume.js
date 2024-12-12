const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const employeeResumeSchema = new Schema({

    employeeId:{type:Schema.Types.ObjectId,ref:"NewEmployee"},
    company:{ type:String},
    leaveStartDate:{ type:Date, require:true},
    leaveEndDate:{ type:Date, require:true},
    resumeOfWorkDate:{ type:Date, require:true},
    comment:{ type:String},

},{timestamps:true, toJSON:{getters:true}})


module.exports = mongoose.model('EmployeeResume', employeeResumeSchema, 'employeeresumes');
