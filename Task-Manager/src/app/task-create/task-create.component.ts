import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TaskService } from '../task.services';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent {
  // name = "";
  title = "";
  description = "";
  priority = 1;

  constructor(public taskService: TaskService){}

  onCreate(form: NgForm){
    console.log('New Task Created', this.title, this.description, this.priority)
    if(form.invalid){
      return;
    }
    this.taskService.createTask(form.value.title, form.value.description, form.value.priority)
  }
  // onLogin(form: NgForm){
  //   console.log('Login submitted', this.email, this.password);
  //   if(form.invalid){
  //     return;
  //   }
  //   this.taskService.loginUser(form.value.email, form.value.password);
  // }
}









// import { Component, EventEmitter, Output } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-task-create',
//   templateUrl: './task-create.component.html',
//   styleUrls: ['./task-create.component.css']
// })
// export class TaskCreateComponent {
//   @Output() createTask = new EventEmitter<any>();

//   createTaskForm: FormGroup;

//   constructor(private fb: FormBuilder) {
//     this.createTaskForm = this.fb.group({
//       title: ['', Validators.required],
//       description: ['', Validators.required],
//       priority: ['', Validators.required]
//     });
//   }

//   onSubmit() {
//     const task = {
//       title: this.createTaskForm.value.title,
//       description: this.createTaskForm.value.description,
//       priority: parseInt(this.createTaskForm.value.priority, 10)
//     };
//     this.createTask.emit(task);
//     this.createTaskForm.reset();
//   }
// }
