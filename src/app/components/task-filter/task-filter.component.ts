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

  tempFilter: TaskFilter = { departments: [], priorities: [] };

  filterTags: Tag[] = [];

  tagsToAdd: Tag[] = [];

  tagsToRemove: Tag[] = [];

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
        this.tempFilter = this.deepCopy(this.filter);
        this.dropdownToggle = dropdown;
      }
    } else {
      this.dropdownToggle = '';
    }
  }

  updateFilter(): void {
    console.log(this.filter);
    this.updateTags();
    this.filter = this.tempFilter;
    this.dropdownToggle = '';
  }

  selectItem(item: Department | Priority | Employee): void {
    switch (this.dropdownToggle) {
      case 'departments':
      case 'priorities':
        {
          console.log('we here');
          if (
            this.tempFilter[this.dropdownToggle].filter((x) => x.id === item.id)
              .length > 0
          ) {
            this.tempFilter[this.dropdownToggle] = this.tempFilter[
              this.dropdownToggle
            ].filter((x) => x.id !== item.id);
            this.tagsToRemove.push({ group: this.dropdownToggle, item });
          } else {
            this.tempFilter[this.dropdownToggle].push(item);
            this.tagsToAdd.push({ group: this.dropdownToggle, item });
          }
        }
        break;
      case 'employee':
        {
          this.tempFilter.employee = item as Employee;
          this.tagsToAdd.push({ group: 'employee', item });
        }
        break;
    }
  }

  clearFilter(): void {
    this.filter = { departments: [], priorities: [] };
    this.tempFilter = { departments: [], priorities: [] };
    this.filterTags = [];
  }

  checkSelected(item: Department | Priority | Employee): boolean {
    switch (this.dropdownToggle) {
      case 'departments':
      case 'priorities': {
        return (
          this.tempFilter[this.dropdownToggle].filter((x) => x.id === item.id)
            .length > 0
        );
      }

      case 'employee': {
        return this.tempFilter.employee?.id === item.id;
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
        this.tempFilter.employee = undefined;
        break;
    }
    this.filterTags = this.filterTags.filter(
      (x) => x.group !== tag.group || x.item.id !== tag.item.id
    );
  }

  private deepCopy(obj: TaskFilter): TaskFilter {
    return JSON.parse(JSON.stringify(obj));
  }

  private updateTags(): void {
    this.filterTags = this.filterTags.filter(
      (x) =>
        this.dropdownToggle !== x.group ||
        this.tagsToRemove.filter((y) => y.item.id === x.item.id).length === 0
    );
    this.filterTags.push(...this.tagsToAdd);
    this.tagsToAdd = [];
    this.tagsToRemove = [];
  }
}
