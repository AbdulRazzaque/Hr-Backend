
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const positionSchema = new Schema({
    position:{type:String,require:true}
},{timestamps:true,toJSON:{getters:true}})

module.exports = mongoose.model("position",positionSchema)