import { Component, OnInit } from '@angular/core';
import { Department } from '../../interfaces/department';
import { AddEmployeeModalComponent } from '../add-employee-modal/add-employee-modal.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Employee } from '../../interfaces/employee';
import { ApiConnectionService } from '../../services/api-connection.service';

@Component({
  selector: 'app-nav-bar',
  imports: [AddEmployeeModalComponent, CommonModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  modalToggle: boolean = false;
  departments!: Department[];

  constructor(private api: ApiConnectionService) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  onCloseModal(changes: boolean) {
    if (changes) {
      let confirmed = window.confirm('გსურთ ფანჯრის დახურვა?');
      if (!confirmed) return;
    }

    this.modalToggle = false;
  }

  openModal() {
    this.modalToggle = true;
  }

  onSubmit(event: Employee) {
    this.api.addEmployee(event).subscribe();
  }

  loadDepartments() {
    if (this.api.departments) {
      this.departments = this.api.departments;
      return;
    }
    this.api.getDepartments().subscribe((departments) => {
      this.departments = departments;
    });
  }
}
