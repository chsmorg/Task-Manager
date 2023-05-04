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
    this.router.navigate(['/task-create']);
  }
  goToListTasks() {
    this.router.navigate(['/task-list']);
  }
 logout(){
  
 }
}
