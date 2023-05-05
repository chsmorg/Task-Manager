const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser');
const firebase = require('firebase/app');
const firebaseAuth = require('firebase/auth');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

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
app.use(cors());
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
    next();
  })

  app.use((req, res, next)=>{
    next();
  })


app.post('/api/login',(req, res) => {
   const { email, password } = req.body;
   console.log(req.body)
    login(email,password,res)
});

app.post('/api/register', (req, res) => {
    const {name, email, password} = req.body
    Register(name,email,password,res)
})

app.get('/api/users/:userId/tasks', (req,res) => {
    console.log(req.body, req.params);
    const {userId} = req.params;
    getAllTasks(userId,res)
});

app.delete('/api/users/:userId/tasks/:taskId', (req,res) => {
    const { userId, taskId } = req.params;
    deleteTask(userId,taskId,res)
})

app.patch('/api/users/:userId/tasks/:taskId', (req,res) => {
    const { userId, taskId } = req.params;
    markTask(userId,taskId,res)
})

app.post('/api/users/:userId/tasks', (req, res, next) => {
   // console.log(req.body, req.params);
    const { userId } = req.params;
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        date: new Date()
    });
    addNewTask(userId, task, res);
});





function login(email, password, res){
    console.log(email,password, new Date())
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
            console.log('MongoDB user created', newUser._id, "on",new Date());

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

  function findUserById(userId) {
    return User.findOne({ _id: userId })
      .then((user) => {
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      })
      .catch((error) => {
        throw error;
      });
  }
  


  const getAllTasks = async (userID,res) => {
    findUserById(userID).then(user => {
        const tasks = Array.from(user.tasks.values());
        res.status(200).json({
            status: true,
            message:"tasks fetched successfully ",
            tasks: tasks
          });
    }).catch(error => {
        const errorMessage = error.message;
          res.status(500).json({
            status: false,
            message: errorMessage
        });
    })
  }

  const addNewTask = async (userID, task, res) => {
    findUserById(userID).then(async user => {
        user.tasks.set(task._id, task);
        await user.save().then(() => {
            res.status(200).json({
                status: true,
                message:"Task Added successfully",
                task: task
            })
        });
        
    }).catch(error => {
        const errorMessage = error.message;
          res.status(500).json({
            status: false,
            message: errorMessage
        });
    });
  }
  

  const markTask = async (userID, taskID, res) => {
    await User.findByIdAndUpdate(userID, {
        $set: {
          [`tasks.${taskID}.status`]: true,
        },
      },{ new: true })
      .then((updatedUser) => {
        if (updatedUser) {
          res.status(200).json({
            status: true,
            message: "Task updated successfully",
          });
        } else {
          res.status(404).json({
            status: false,
            message: "Task does not exist",
          });
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        res.status(500).json({
          status: false,
          message: errorMessage,
        });
      });
  };


  const deleteTask = async (userID, taskID, res) => {
    findUserById(userID).then( async user => {
        if (user.tasks.has(taskID)) {
            user.tasks.delete(taskID);
            await user.save().then(_ => {
                res.status(200).json({
                    status: true,
                    message:"Task deleted successfully"
                })
            });
        }else{
            res.status(404).json({
                status: false,
                message:"Task does not exist"
            })
        }
         
      })
      .catch(error => {
        const errorMessage = error.message;
          res.status(500).json({
            status: false,
            message: errorMessage
        });
      });
  }

module.exports = app;






  


