import { Routes } from '@angular/router';
import { TasksPageComponent } from './components/tasks-page/tasks-page.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { TaskEditionPageComponent } from './components/task-editing-page/task-editing-page.component';

export const routes: Routes = [
  { path: 'tasks', component: TasksPageComponent, },
  { path: 'tasks/:id', component: TaskDetailsComponent },
  { path: 'add-task', component: TaskEditionPageComponent },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: '**', redirectTo: '/tasks' },
];
