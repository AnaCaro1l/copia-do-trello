import { Component, Input } from '@angular/core';
import { Frame } from '../../types/frame';
import { TaskList } from '../../types/tasklist';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '../task-list/task-list.component';
import { AvatarModule } from 'primeng/avatar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AuthService, AuthSession } from '../../services/auth.service';
import { LucideAngularModule, UsersRound, UserRoundPlus, Ellipsis } from 'lucide-angular';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [TaskListComponent, CommonModule, AvatarModule, OverlayPanelModule, LucideAngularModule],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss',
})
export class FrameComponent {
  readonly usersRound = UsersRound;
  readonly userRoundPlus = UserRoundPlus;
  readonly ellipsis = Ellipsis;

  @Input() frame: Frame | null = null;
  @Input() editable: boolean = false;

  constructor(private authService: AuthService) {}

  getCurrentUser() {
    const session: AuthSession | null = this.authService.sessionValue;
    if (session?.user) return session.user;
    try {
      const currentUser = JSON.parse(
        localStorage.getItem('currentUser') || 'null'
      );
      if (!currentUser) return null;
      return currentUser.user || currentUser;
    } catch {
      return null;
    }
  }
}
