const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const warningSchema = new Schema({
    
    employeeId:{type:Schema.Types.ObjectId,ref:"NewEmployee"},
    date:{type:Date,require:true},
    warningType:{type:String,require:true},
    penaltyAmount:{type:String},
    subject:{type:String},
},{timestamps:true,toJSON:{getters:true}})

module.exports = mongoose.model("warning",warningSchema)