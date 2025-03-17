import { Component } from '@angular/core';
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

  departments: Department[] = [
    {
      id: 1,
      name: 'ადმინისტრაციის დეპარტამენტი',
    },
    {
      id: 2,
      name: 'ადამიანური რესურსების დეპარტამენტი',
    },
    {
      id: 3,
      name: 'ფინანსების დეპარტამენტი',
    },
    {
      id: 4,
      name: 'გაყიდვები და მარკეტინგის დეპარტამენტი',
    },
    {
      id: 5,
      name: 'ლოჯოსტიკის დეპარტამენტი',
    },
    {
      id: 6,
      name: 'ტექნოლოგიების დეპარტამენტი',
    },
    {
      id: 7,
      name: 'მედიის დეპარტამენტი',
    },
  ];

  priorities: Priority[] = [
    {
      id: 1,
      name: 'დაბალი',
      icon: 'https://momentum.redberryinternship.ge/storage/priority-icons/Low.svg',
    },
    {
      id: 2,
      name: 'საშუალო',
      icon: 'https://momentum.redberryinternship.ge/storage/priority-icons/Medium.svg',
    },
    {
      id: 3,
      name: 'მაღალი',
      icon: 'https://momentum.redberryinternship.ge/storage/priority-icons/High.svg',
    },
  ];

  employees: Employee[] = [
    {
      id: 1,
      name: 'ემილია',
      surname: 'მორგანო',
      avatar: 'https://pbs.twimg.com/media/FhzlIPvUYAA7lIl.jpg',
      department_id: 1,
    },
    {
      id: 2,
      name: 'danny',
      surname: 'devito',
      avatar: 'https://pbs.twimg.com/media/FhzlIPvUYAA7lIl.jpg',
      department_id: 2,
    },
  ];

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
