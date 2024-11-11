const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const employeeResumeSchema = new Schema({

    employeeId:{type:Schema.Types.ObjectId,ref:"NewEmployee"},
    company:{ type:String, require:true},
    leaveStartDate:{ type:Date, require:true},
    leaveEndtDate:{ type:Date, require:true},
    resumeOfWorkDate:{ type:Date, require:true},
    comment:{ type:String, require:true},

},{timestamps:true, toJSON:{getters:true}})


module.exports = mongoose.model('EmployeeResume', employeeResumeSchema, 'employeeresumes');
