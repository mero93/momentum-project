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
  oldDropdownStatus: string = '';

  filter: TaskFilter = { departments: [], priorities: [] };

  pendingFilter: TaskFilter = { departments: [], priorities: [] };

  filterTags: Tag[] = [];

  pendingFilterTags: Tag[] = [];

  @Input() departments!: Department[];

  @Input() priorities!: Priority[];

  @Input() employees!: Employee[];

  toggleDropdown(dropdown?: string): void {
    if (dropdown && this.dropdownToggle !== dropdown) {
      if (this.oldDropdownStatus === '') {
        this.pendingFilter = this.deepCopy(this.filter);
        this.pendingFilterTags = [...this.filterTags];
      }
      this.dropdownToggle = dropdown;
    } else {
      this.dropdownToggle = '';
      this.clearPendingFilter();
    }

    this.oldDropdownStatus = this.dropdownToggle;
    console.log(
      `current dropdown ${this.dropdownToggle} old dropdown ${this.oldDropdownStatus}`
    );
  }

  updateFilter(): void {
    this.filter = this.deepCopy(this.pendingFilter);
    this.filterTags = [...this.pendingFilterTags];
    this.dropdownToggle = '';
  }

  selectItem(item: Department | Priority | Employee): void {
    switch (this.dropdownToggle) {
      case 'departments':
      case 'priorities':
        {
          if (
            this.pendingFilter[this.dropdownToggle].some(
              (x) => x.id === item.id
            )
          ) {
            this.pendingFilter[this.dropdownToggle] = this.pendingFilter[
              this.dropdownToggle
            ].filter((x) => x.id !== item.id);
            this.pendingFilterTags = this.pendingFilterTags.filter(
              (x) => x.group !== this.dropdownToggle || x.item.id !== item.id
            );
          } else {
            this.pendingFilter[this.dropdownToggle].push(item);
            this.pendingFilterTags.push({
              group: this.dropdownToggle,
              item: item,
            });
          }
        }
        break;
      case 'employee':
        {
          if (this.pendingFilter.employee?.id === item.id) {
            this.pendingFilter.employee = undefined;
            this.pendingFilterTags = this.pendingFilterTags.filter(
              (x) => x.group !== this.dropdownToggle
            );
          } else {
            this.pendingFilter.employee = item as Employee;
            this.pendingFilterTags.push({
              group: this.dropdownToggle,
              item: item,
            });
          }
        }

        break;
    }

    console.log(this.pendingFilter, this.filter);
  }

  clearFilter(): void {
    this.filter = { departments: [], priorities: [] };
    this.filterTags = [];
    this.clearPendingFilter();
  }

  clearPendingFilter(): void {
    this.pendingFilter = { departments: [], priorities: [] };
    this.pendingFilterTags = [];
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

  setFilterTags() {}
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
