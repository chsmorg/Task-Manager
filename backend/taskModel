const mongoose = require('mongoose')
const userModel = require('./userModel')

taskSchema = mongoose.Schema({
  title: {type:String, required: true },
  taskDetails:{type:String, require: true},
  taskID: {type:String, require: true},
  date: {type:Date, require: true},
  status:{type:Boolean, require: true}
})

module.exports = mongoose.model('Task', taskSchema)