import{ Injectable} from '@angular/core'
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
// import {Post} from './post.model';
import {User} from './user.model'
import {Task} from './task.model'
import { DatabaseTask } from './database-task.model';
import {map} from 'rxjs/operators'
import { Router } from '@angular/router';


@Injectable({providedIn: 'root'})

// export interface Post{
//     id:string;
//     title: string;
//     content: string;
// }


export class TaskService {

  tasks: DatabaseTask[] = [];
  userID = "";
  name = "";

  isLoggedIn = false;

  constructor(private http: HttpClient, private router: Router){
    // Retrieve UserID from local storage on application startup
    const userID = localStorage.getItem('userID');
    console.log("userID from localStorage: ", userID);
    if (userID) {
      this.userID = userID;
      this.isLoggedIn = true;
    }
  }

  loginUser(email: string, password: string){
    // const user: User = {id: '', name: ''}
    // const loginUser = {email: email, password: password}
    // console.log(email)
    // console.log(password)
    const user: User = {name: '', email: email, password: password}
    this.http.post<{status:boolean, message:string, userID:string, name:string}>("http://192.168.170.182:3000/api/login",user)
    // this.http.post<{message:string, id:string}>("http://192.168.170.182:3000/api/login",user)
    // this.http.post<{message:string, id:string}>("http://localhost:3000/api/login",user)
    .subscribe((responseData)=>{
      if(responseData.status){
        this.userID=responseData.userID;
        this.name=responseData.name;
        this.isLoggedIn = true;
        localStorage.setItem('userID', this.userID);
        console.log("Name ", responseData.name);
        console.log("UserID ", responseData.userID);
        console.log("Login success.")
        // Navigate to /tasks route
        this.router.navigate(['/tasks']);
      }else{
        console.log("Login failed.");
      }
      // const id = responseData.
      // console.log("HERE")
      // let resJson = JSON.parse(responseData);
      // console.log(responseData);
      // console.log(responseData.message)
      // console.log(responseData.userID)
    })
  }

  registerUser(name: string, email: string, password: string){
    const user: User = {name: name, email: email, password: password}
    this.http.post<{message:string, id:string}>("http://192.168.170.182:3000/api/register",user)
    // this.http.post<{message:string, id:string}>("http://localhost:3000/api/register",user)
    .subscribe((responseData)=>{
      // const id = responseData.
      console.log(responseData);
    })
  }

  createTask(title: string, description: string, priority: number){
    const task: Task = {title: title, description: description, priority: priority, userID: this.userID}
    console.log(task);
    this.http.post<{status: string, message:string, task:any}>("http://192.168.170.182:3000/api/users/"+this.userID+"/tasks",task)
    // this.http.post<{status: string, message:string, taskID:string}>("http://localhost:3000/api/users/"+this.userID+"/tasks",task)
    // /api/users/:userId/tasks
    // this.http.post<{message:string, id:string}>("http://localhost:3000/api/register",user)
    .pipe(
      map((responseData) => {
        const task = responseData.task;
        console.log(task)
        console.log(responseData)
        return {
          title: task.title,
          description: task.description,
          date: task.date,
          priority: task.priority,
          _id: task._id,
          status: task.status ? 1 : 0
        };
      })
    )
    .subscribe((transformedTask)=>{
      console.log("here sadlgf")
      console.log(transformedTask);
      this.tasks.push(transformedTask);
      console.log(this.tasks);
    })
    // .pipe(map((taskdata)=>{
    //   return taskdata.databasetask.map(dbtask =>{
    //     return {
    //       title: dbtask.title,
    //       description: dbtask.description,
    //       data: dbtask.date,
    //       priority: dbtask.priority,
    //       _id: dbtask._id,
    //       status: dbtask.status
    //     }
    //   })
    // }))
    // .subscribe((responseData)=>{
    //   // const id = responseData.
    //   console.log(responseData);
    //   if(responseData.status){
    //     console.log("Task added successfully.");
    //     console.log(task.title);
    //     console.log("HERE")
    //     console.log(responseData.databasetask.title)
    //     // this.tasks.push(responseData.databasetask);
    //     // console.log(databasetask.)
    //     // console.log(task.description)
    //     // console.log(task.)
    //     // const databasetask = {title: task.title, description: task.description, date: task.date}
    //     // this.tasks.push(task);
    //     // const databasetasks: DatabaseTask = databasetask;
    //     // this.tasks.push(responseData.databasetask);
    //   }
    // })




    // this.http.post<{status: string, message:string, databasetask:DatabaseTask}>("http://192.168.170.182:3000/api/users/"+this.userID+"/tasks",task)
    // // this.http.post<{status: string, message:string, taskID:string}>("http://localhost:3000/api/users/"+this.userID+"/tasks",task)
    // // /api/users/:userId/tasks
    // // this.http.post<{message:string, id:string}>("http://localhost:3000/api/register",user)
    // .subscribe((responseData)=>{
    //   // const id = responseData.
    //   console.log(responseData);
    //   if(responseData.status){
    //     console.log("Task added successfully.");
    //     console.log(task.title);
    //     console.log("HERE")
    //     console.log(responseData.databasetask.title)
    //     // this.tasks.push(responseData.databasetask);
    //     // console.log(databasetask.)
    //     // console.log(task.description)
    //     // console.log(task.)
    //     // const databasetask = {title: task.title, description: task.description, date: task.date}
    //     // this.tasks.push(task);
    //     // const databasetasks: DatabaseTask = databasetask;
    //     // this.tasks.push(responseData.databasetask);
    //   }
    // })




  }

}
// export class PostService {
//  private posts: Post[] = [];
//  private postUpDate = new Subject<Post[]>()

//  constructor(private http: HttpClient){}

//  addPost(title: string, content: string){
//   const post: Post ={id:null, title: title, content: content};
//   this.http.post<{message:string, postId:string }>("http://localhost:3000/api/posts",post)
//   .subscribe((responseData)=>{
//    const id = responseData.postId
//    post.id = id
//     this.posts.push(post);
//     this.postUpDate.next([...this.posts]);
//   })

//  }

// }
