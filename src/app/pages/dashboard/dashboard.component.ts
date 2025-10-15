import { Component, Input } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../../components/header/header.component';
import { MessageService } from 'primeng/api';
import { FrameComponent } from '../../components/frame/frame.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ToastModule, HeaderComponent, FrameComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [MessageService],
})
export class DashboardComponent {
  @Input() isMenuOpen: boolean = true;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

   getFrameData() {
    return {
      id: '1',
      title: 'Project Alpha',
      createdAt: new Date(),
      updatedAt: new Date(),
      coverImageUrl: 'linear-gradient( 135deg, #6B73FF 10%, #000DFF 100%)',
      coverColor: null,
      taskLists: [
        {
          id: '1',
          title: 'To Do',
          tasks: [
            {
              id: 1,
              tasklistId: 1,
              title: 'Task 1',
              description: 'Description for Task 1',
              createdAt: new Date(),
              updatedAt: new Date(),
              completed: false,
              tags: ['urgent', 'home'],
              dueDate: null,
              members: ['user1'],
              comments: [],
              coverImageUrl: null,
              coverColor: '#5EB5EB',
            },
            {
              id: 2,
              tasklistId: 1,
              title: 'Task 2',
              description: 'Description for Task 2',
              createdAt: new Date(),
              updatedAt: new Date(),
              completed: false,
              tags: [],
              dueDate: null,
              members: ['user1'],
              comments: [],
              coverImageUrl: null,
              coverColor: null,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          coverImageUrl: null,
          coverColor: null,
          archived: false,
          isOpen: true,
        },
        {
          id: '2',
          title: 'In Progress',
          tasks: [
            {
              id: 2,
              tasklistId: 2,
              title: 'Task 2',
              description: 'Description for Task 2',
              createdAt: new Date(),
              updatedAt: new Date(),
              completed: false,
              tags: [],
              dueDate: null,
              members: ['user1'],
              comments: [],
              coverImageUrl: null,
              coverColor: null,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          coverImageUrl: null,
          coverColor: null,
          archived: false,
          isOpen: true,
        },
        {
          id: '3',
          title: 'Done',
          tasks: [
            {
              id: 3,
              tasklistId: 3,
              title: 'Task 3',
              description: 'Description for Task 3',
              createdAt: new Date(),
              updatedAt: new Date(),
              completed: false,
              tags: ['urgent', 'home'],
              dueDate: null,
              members: ['user1'],
              comments: [],
              coverImageUrl: null,
              coverColor: null,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          coverImageUrl: null,
          coverColor: null,
          archived: false,
          isOpen: true,
        },
      ],
      members: ['user1', 'user2'],
      visibility: 'private' as const,
      favorite: false,
    };
  }
}
