import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TaskService } from '../task.services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // name = "";
  email = "";
  password = "";

  constructor(public taskService: TaskService){}

  onLogin(form: NgForm){
    console.log('Login submitted', this.email, this.password);
    if(form.invalid){
      return;
    }
    this.taskService.loginUser(form.value.email, form.value.password);
  }
}



