const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const mongoose = require('mongoose')

const taskModel = require('./taskModel')
const userModel = require('./userModel')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))