const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser');
const firebase = require('firebase/app');
const firebaseAuth = require('firebase/auth');
const { v4: uuidv4 } = require('uuid');

const mongoose = require('mongoose');

const Task = require('./taskModel')
const User = require('./userModel');


const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  };

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

mongoose.connect(process.env.DB)
.then(()=>{
  console.log('Connected to database')
})
.catch((err)=>{
    console.error(err)
})


firebase.initializeApp(firebaseConfig);
const auth = firebaseAuth.getAuth();

function signUp(name, email, password) {
    return new Promise(async (resolve, reject) => {
      firebaseAuth.createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const newUser = new User({
            name: name,
            userID: userCredential.user.uid,
            tasks: []
          });
          try {
            await newUser.save();
            console.log('MongoDB user created', newUser._id);
            resolve(newUser);
          } catch (error) {
            console.error('Error creating MongoDB user:', error);
            reject(error);
          }
  
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          reject(error);
        });
    });
  }
  

const addTaskToUser = async (userId, task) => {
    try {
      const user = await User.findOne({ _id: userId });
  
      if (!user) {
        console.log('User not found');
        return;
      }
      //adds the task
      user.tasks.set(task._id, task);
  
      await user.save();
      console.log('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };




signUp('test', 'test@example.com', 'password123')
  .then(newUser => {
    console.log(newUser._id)
    addTaskToUser(newUser._id, newTask)
    addTaskToUser(newUser._id, newTask1)
    newUser.save()
  })
  .catch(error => {
    console.error('Error in signUp:', error);
  });




  const newTask = new Task({
    title: 'Sample Task',
    description: 'This is a sample task.',
    date: Date.now
  });

  const newTask1 = new Task({
    title: 'Sample Task 2',
    description: 'This is also a sample task.',
    date: Date.now
  });

//   addTaskToUser(user._id, newTask)
//   addTaskToUser(user._id, newTask1)




  


