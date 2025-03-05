
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const departmentSchema = new Schema ({
    department:{type:String,require:true}
},{timestamps:true,toJSON:{getters:true}})


module.exports = mongoose.model("department",departmentSchema)