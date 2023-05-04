import { Component } from '@angular/core';
import { TaskService } from '../task.services';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = "";
  email = "";
  password = "";

  constructor(public taskService: TaskService){}

  onRegister(form: NgForm){
    console.log('Register submitted', this.name, this.email, this.password);
    if(form.invalid){
      return;
    }
    this.taskService.registerUser(form.value.name, form.value.email, form.value.password);
  }



}
