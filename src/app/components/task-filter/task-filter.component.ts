import { Component, Input } from '@angular/core';
import { Status } from '../../interfaces/status';
import { Priority } from '../../interfaces/priority';
import { Employee } from '../../interfaces/employee';
import { TaskFilter } from '../../interfaces/task-filter';
import { CommonModule } from '@angular/common';
import { Department } from '../../interfaces/department';
import { Tag } from '../../interfaces/tag';

@Component({
  selector: 'app-task-filter',
  imports: [CommonModule],
  templateUrl: './task-filter.component.html',
  styleUrl: './task-filter.component.scss',
})
export class TaskFilterComponent {
  dropdownToggle: string = '';

  filter: TaskFilter = { departments: [], priorities: [] };

  pendingFilter: TaskFilter = { departments: [], priorities: [] };

  filterTags: Tag[] = [];

  pendingTags: Tag[] = [];

  @Input() departments!: Department[];

  @Input() priorities!: Priority[];

  @Input() employees!: Employee[];

  toggleDropdown(dropdown?: string): void {
    if (dropdown) {
      if (this.dropdownToggle === dropdown) {
        this.dropdownToggle = '';
      } else {
        this.pendingFilter = this.deepCopy(this.filter);
        this.pendingTags = [...this.filterTags];
        this.dropdownToggle = dropdown;
      }
    } else {
      this.dropdownToggle = '';
    }
  }

  updateFilter(): void {
    console.log(this.filter);
    this.filterTags = this.pendingTags;
    this.filter = this.pendingFilter;
    this.dropdownToggle = '';
  }

  selectItem(item: Department | Priority | Employee): void {
    switch (this.dropdownToggle) {
      case 'departments':
      case 'priorities':
        {
          if (
            this.pendingFilter[this.dropdownToggle].filter(
              (x) => x.id === item.id
            ).length > 0
          ) {
            this.pendingFilter[this.dropdownToggle] = this.pendingFilter[
              this.dropdownToggle
            ].filter((x) => x.id !== item.id);
            this.pendingTags = this.pendingTags.filter(
              (x) => x.group !== this.dropdownToggle || x.item.id !== item.id
            );
          } else {
            this.pendingFilter[this.dropdownToggle].push(item);
            this.pendingTags.push({ group: this.dropdownToggle, item });
          }
        }
        break;
      case 'employee':
        {
          if (this.pendingFilter.employee?.id === item.id) {
            this.pendingTags = this.pendingTags.filter(
              (x) => x.group !== this.dropdownToggle
            );
            this.pendingFilter.employee = undefined;
          } else {
            this.pendingTags = this.pendingTags.filter(
              (x) => x.group !== this.dropdownToggle
            );
            this.pendingTags.push({ group: this.dropdownToggle, item });
            this.pendingFilter.employee = item as Employee;
          }
        }
        break;
    }
  }

  clearFilter(): void {
    this.filter = { departments: [], priorities: [] };
    this.pendingFilter = { departments: [], priorities: [] };
    this.filterTags = [];
  }

  checkSelected(item: Department | Priority | Employee): boolean {
    switch (this.dropdownToggle) {
      case 'departments':
      case 'priorities': {
        return (
          this.pendingFilter[this.dropdownToggle].filter(
            (x) => x.id === item.id
          ).length > 0
        );
      }

      case 'employee': {
        return this.pendingFilter.employee?.id === item.id;
      }
    }

    return false;
  }

  removeTag(tag: Tag): void {
    switch (tag.group) {
      case 'departments':
      case 'priorities':
        {
          this.filter[tag.group] = this.filter[tag.group].filter(
            (x) => x.id !== tag.item.id
          );
        }
        break;
      case 'employee':
        this.pendingFilter.employee = undefined;
        break;
    }
    this.filterTags = this.filterTags.filter(
      (x) => x.group !== tag.group || x.item.id !== tag.item.id
    );
  }

  private deepCopy(obj: TaskFilter): TaskFilter {
    return JSON.parse(JSON.stringify(obj));
  }
}
