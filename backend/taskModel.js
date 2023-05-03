const mongoose = require('mongoose')
const userModel = require('./userModel')

taskSchema = mongoose.Schema({
  title: {type:String, required: true },
  taskDetails:{type:String, require: true},
  status:{type:String, require: true},
  takenBy:{type:userModel, require: false}
})

module.exports = mongoose.model('Task', taskSchema)