import{ Injectable} from '@angular/core'
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
// import {Post} from './post.model';
import {User} from './user.model'
import {Task} from './task.model'
import { DatabaseTask } from './database-task.model';
import {map} from 'rxjs/operators'
import { Data, Router } from '@angular/router';


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
  private taskUpDate = new Subject<DatabaseTask[]>()


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
  getTaskUpdateListener(){
    return this.taskUpDate.asObservable();
  }

  deleteTask(task: DatabaseTask){
    const taskID = task._id
    this.http.delete<{message: string, status: Boolean}>("http://localhost:3000/api/users/"+this.userID+"/tasks/"+task._id)
    .subscribe((responseData)=>{
      if(responseData.status){
        const updatedTasks = this.tasks.filter(task => task._id !== taskID)
        this.tasks = updatedTasks
        this.taskUpDate.next([...this.tasks])
        console.log(responseData.message)
      }else{
        console.log("delete failed.");
      }
    });
  }

  markTask(task: DatabaseTask){
    const taskID = task._id
    const updatedData = { status: 1 };
    this.http.patch<{message: string, status: Boolean}>("http://localhost:3000/api/users/"+this.userID+"/tasks/"+task._id,updatedData)
    .subscribe((responseData)=>{
      if(responseData.status){
        const updatedTasks = this.tasks.map((task) => {
          if (task._id === taskID) {
            return { ...task, status: 1 };
          }
          return task;
        });

        this.tasks = updatedTasks
        this.taskUpDate.next([...this.tasks])
        console.log(responseData.message)
      }else{
        console.log("mark failed.");
      }
    });

  }

  getTasks(){

    // this.http.get<{message: string, tasks: any}>("http://192.168.170.182:3000/api/users/"+this.userID+"/tasks")
    this.http.get<{message: string, tasks: any}>("http://localhost:3000/api/users/"+this.userID+"/tasks")
    .pipe(map((taskData)=>{
      console.log(taskData);
      // if (taskData && taskData.tasks) {
        return taskData.tasks.map((task:DatabaseTask) =>{
          return {
            title: task.title,
            description: task.description,
            date: task.date,
            priority: task.priority,
            _id: task._id,
            status: task.status ? 1 : 0
          }
        });
      // }else{
        // return [];
      // }
    }))
    .subscribe((transformedTask)=>{
      // console.log(tasks);
    this.tasks = transformedTask;
    this.taskUpDate.next([...this.tasks]);
    // this.postUpDate.next([...this.tasks]);
  });
  }

//   getPosts(){
//     this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
//     .pipe(map((postData)=>{
//       return postData.posts.map(post =>{
//         return {
//           title: post.title,
//           content: post.content,
//           id: post._id
//         }
//       })
//     }))
//     .subscribe((transformedPost)=>{
//     this.posts = transformedPost;
//     this.postUpDate.next([...this.posts]);
//   });

//  }


  loginUser(email: string, password: string){
    // const user: User = {id: '', name: ''}
    // const loginUser = {email: email, password: password}
    // console.log(email)
    // console.log(password)
    const user: User = {name: '', email: email, password: password}
    this.http.post<{status:boolean, message:string, userID:string, name:string}>("http://localhost:3000/api/login",user)
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

        this.getTasks();
        console.log(this.tasks);

        // Navigate to /tasks route
        this.router.navigate(['/task-list']);
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
    this.http.post<{message:string, id:string}>("http://localhost:3000/api/register",user)
    // this.http.post<{message:string, id:string}>("http://localhost:3000/api/register",user)
    .subscribe((responseData)=>{
      // const id = responseData.
      console.log(responseData);
    })
  }

  createTask(title: string, description: string, priority: number){
    const task: Task = {title: title, description: description, priority: priority, userID: this.userID}
    console.log(task);
    this.http.post<{status: string, message:string, task:any}>("http://localhost:3000/api/users/"+this.userID+"/tasks",task)
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
