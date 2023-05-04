import{ Injectable} from '@angular/core'
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
// import {Post} from './post.model';
import {User} from './user.model'
import {map} from 'rxjs/operators'


@Injectable({providedIn: 'root'})

// export interface Post{
//     id:string;
//     title: string;
//     content: string;
// }


export class TaskService {

  isLoggedIn = false;

  constructor(private http: HttpClient){}

  loginUser(email: string, password: string){
    // const user: User = {id: '', name: ''}
    // const loginUser = {email: email, password: password}
    console.log(email)
    console.log(password)
    const user: User = {name: '', email: email, password: password}
    this.http.post<{message:string, id:string}>("http://192.168.170.182:3000/api/login",user)
    .subscribe((responseData)=>{
      // const id = responseData.
      console.log(responseData);
      this.isLoggedIn = true;
    })
  }

  registerUser(name: string, email: string, password: string){
    const user: User = {name: name, email: email, password: password}
    this.http.post<{message:string, id:string}>("http://192.168.170.182:3000/api/register",user)
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
