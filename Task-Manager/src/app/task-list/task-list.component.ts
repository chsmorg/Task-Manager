import {Component,  OnInit, OnDestroy} from "@angular/core";
import { Subscription, EMPTY } from "rxjs";
import { DatabaseTask } from '../database-task.model';
import { TaskService } from '../task.services';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: DatabaseTask[] = [];
  filteredTasks: DatabaseTask[] = [];

  filter = {
    completed: false,
    priority: false,
    date: false
  };

  constructor(public taskService: TaskService){}
  private taskSub: Subscription = EMPTY.subscribe();

  ngOnInit() {

    this.taskService.getTasks();
    this.taskSub = this.taskService.getTaskUpdateListener().subscribe((tasks: DatabaseTask[])=>{
      this.tasks = tasks;
      this.applyFilters()
    });

  } 

  ngOnDestroy(){
    this.taskSub.unsubscribe();
  }

  markCompleted(task: DatabaseTask) {
    task.status = 1
    console.log(task._id,task.title)
    this.applyFilters()
  }

  deleteTask(task: DatabaseTask){
    console.log(task._id,task.title, task.status)
  }
  

  toggleFilter(filterName: keyof typeof TaskListComponent.prototype.filter) {
    this.filter[filterName] = !this.filter[filterName];
    this.applyFilters();
  }

  applyFilters() {
    let filteredTasks = [...this.tasks];

    if (this.filter.completed) {
      filteredTasks = filteredTasks.filter(task => task.status);
    }
    else{
      filteredTasks = filteredTasks.filter(task => !task.status);
    }

    

    const sortOrderPriority = this.filter.priority ? 1 : -1;
    const sortOrderDate = this.filter.date ? 1 : -1;
    

    filteredTasks.sort((a, b) => {
      const priorityDiff = (Number(b.priority) - Number(a.priority)) * sortOrderPriority;
      const dateDiff = (new Date(a.date).getTime() - new Date(b.date).getTime()) * sortOrderDate;
    
      return priorityDiff !== 0 ? priorityDiff : dateDiff;
    });
    
    this.filteredTasks = filteredTasks;
  }
}
