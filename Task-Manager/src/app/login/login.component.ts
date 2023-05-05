import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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
  // constructor(private router: Router) { }
  constructor(public taskService: TaskService, private router: Router){}

  onLogin(form: NgForm){
    console.log('Login submitted', this.email, this.password);
    if(form.invalid){
      return;
    }
    this.taskService.loginUser(form.value.email, form.value.password);
  }
  goToRegister() {
    // if(!localStorage)
    // if ('userID' in localStorage) {
      // 'userID' exists in local storage
      this.router.navigate(['/register']);
    // } else {
      // 'userID' does not exist in local storage
      // alert("Please log in first.")
    // }
  }
}



