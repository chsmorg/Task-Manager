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

app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
    );
    console.log('Middleware');
    next();
  })

  app.use((req, res, next)=>{
    next();
  })

  app.post("/api/newTask/:id",(req,res,next)=>{
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      date: Date.now
    })
        addTask(req.params.id, task, res)
    })

app.post('/api/login',(req, res) => {
   const { email, password } = req.body;
   console.log(req.body)
//    const email = req.body.email;
//    const password = req.body.password;
    login(email,password,res)
});

app.post('/api/register', (req, res) => {
    const {name, email, password} = req.body
    Register(name,email,password,res)
})



function login(email, password, res){
    console.log(email,password)
    firebaseAuth.signInWithEmailAndPassword(auth, email, password)
    .then( async (userCredential) => {
        try {
            const user = await User.findOne({ userID:  userCredential.user.uid });
            if (!user) {
                res.status(401).json({
                    status: false,
                    message: 'Login unsuccessful: User not found',
                    });
                return;
            }
            res.status(201).json({
                status: true,
                message:'Login successful',
                userID: user._id,
                name: user.name
                });

        }
        catch{
            res.status(401).json({
                status: false,
                message: 'Login unsuccessful: User not found',
                });
        }
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        res.status(500).json({
            status: false,
            message: errorMessage
            });
        });
}

function Register(name, email, password, res) {
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

            res.status(201).json({
                status: true,
                message:'Register successful',
                userID: newUser._id,
                name: newUser.name
                });
          } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
          }
  
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          res.status(500).json({
            status: false,
            message: errorMessage
        });
    });
  }


  
  const addTask = async (userId, task, res) => {
    try {
      const user = await User.findOne({ _id: userId });
  
      if (!user) {
        console.log('User not found');
        return;
      }
      //adds the task
      user.tasks.set(task._id, task);
  
      await user.save().then(task=> {
        res.status(201).json({
          message:'task added successful',
          taskId: task._id
        });
      });
      console.log('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };


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




// signUp('test', 'test@example.com', 'password123')
//   .then(newUser => {
//     console.log(newUser._id)
//     addTaskToUser(newUser._id, newTask)
//     addTaskToUser(newUser._id, newTask1)
//   })
//   .catch(error => {
//     console.error('Error in signUp:', error);
//   });




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

module.exports = app;
//   addTaskToUser(user._id, newTask)
//   addTaskToUser(user._id, newTask1)




  


