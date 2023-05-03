const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const firebase = require('firebase/app');
const firebaseAuth = require('firebase/auth')

const mongoose = require('mongoose')

// const taskModel = require('./taskModel')
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

function signUp(name,email, password){
    firebaseAuth.createUserWithEmailAndPassword(auth, email, password)
  .then( async (userCredential) => {
    // Signed in 
    const newUser = new User({
        name: name,
        userID: userCredential.user.uid,
        tasks: []
      });
      try {
        await newUser.save();
        console.log('MongoDB user created:', newUser);
      } catch (error) {
        console.error('Error creating MongoDB user:', error);
      }
      
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage)
  });
}



//signUp("Chase2", "test1@test.com", "password")

  


