const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')

const mongoose = require('mongoose')

// const taskModel = require('./taskModel')
// const userModel = require('./userModel')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

mongoose.connect(process.env.DB)
.then(()=>{
  console.log('Connected to database')
})
.catch((err)=>{
    console.error(err)
})


