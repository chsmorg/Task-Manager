import{ Injectable} from '@angular/core'
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
// import {Post} from './post.model';
import {User} from './user.model'
import {Task} from './task.model'
import {map} from 'rxjs/operators'


@Injectable({providedIn: 'root'})

// export interface Post{
//     id:string;
//     title: string;
//     content: string;
// }


export class TaskService {

  userID = "";
  name = "";

  isLoggedIn = false;

  constructor(private http: HttpClient){}

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
        console.log("Name ", responseData.name);
        console.log("UserID ", responseData.userID);
        console.log("Login success.")
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
    this.http.post<{status: string, message:string, taskID:string}>("http://192.168.170.182:3000/api/users/"+this.userID+"/tasks",task)
    // /api/users/:userId/tasks
    // this.http.post<{message:string, id:string}>("http://localhost:3000/api/register",user)
    .subscribe((responseData)=>{
      // const id = responseData.
      console.log(responseData);
    })
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
