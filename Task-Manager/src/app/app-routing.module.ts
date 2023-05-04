import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
// import { TaskCreateComponent } from './task-create/task-create.component';
import {TaskCreateComponent} from './task-create/task-create.component';
import { TaskListComponent } from './task-list/task-list.component';

const routes: Routes = [
  {
    path:'', component: LoginComponent
  },
  {
    path:'register', component: RegisterComponent
  },
  {
    path:'task-create', component: TaskCreateComponent
  },
  {
    path:'task-list',component: TaskListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }







// import { NgModule } from "@angular/core";
// import { RouterModule, Routes } from "@angular/router";
// import { PostCreateComponent } from "./post/post-create/post-create.component";
// import { PostListComponent } from "./post/post-create/post-list/post-list.component";

// const routes: Routes = [
//   {
//     path:'', component: PostListComponent
//   },
//   {
//     path:'create',component: PostCreateComponent
//   }
// ]

// @NgModule({
//   imports:[RouterModule.forRoot(routes)],
//   exports:[RouterModule]
// })

// export class AppRoutingModule{

// }
