import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router: Router) { }
  goToCreateTask() {
    // if ('userID' in localStorage) {
    //   // 'userID' exists in local storage
    //   this.router.navigate(['/task-create']);
    // } else {
    //   // 'userID' does not exist in local storage
    //   alert("Please log in first.")
    // }
    if (localStorage.getItem('userID') !== null) {
      // 'userID' exists in local storage
      this.router.navigate(['/task-create']);
    } else {
      // 'userID' does not exist in local storage
      alert("Please log in first.")
    }
  }
  goToListTasks() {
    // if(!localStorage)
    if ('userID' in localStorage) {
      // 'userID' exists in local storage
      this.router.navigate(['/task-list']);
    } else {
      // 'userID' does not exist in local storage
      alert("Please log in first.")
    }
  }
 logout(){
    // localStorage.setItem('userID', "");
    localStorage.removeItem('userID');
    this.router.navigate(['']);
 }
}
