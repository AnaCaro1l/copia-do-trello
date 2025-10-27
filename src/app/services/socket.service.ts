import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { TaskList } from '../types/tasklist';
import { Frame } from '../types/frame';
import { AuthService, AuthSession } from './auth.service';
import { Task } from '../types/task';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket: Socket;

  constructor(private authService: AuthService) {
    this.socket = io(environment.apiUrl);

    this.socket.on('connect', () => {
      console.log('[SocketService] connected', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketService] disconnected', reason);
    });

    const current = this.getCurrentUser();
    if (current) {
      this.connect();
    }
  }

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

  connect(): void {
    this.socket.connect();
  }

  joinUserRoom(userId: number): void {
    this.socket.emit('join_user', userId);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinWorkspace(workspaceId: number): void {
    if (this.socket.connected) {
      this.socket.emit('join_workspace', workspaceId);
    } else {
      // wait for connection then join
      this.socket.once('connect', () => {
        this.socket.emit('join_workspace', workspaceId);
      });
    }
  }

  leaveWorkspace(workspaceId: number): void {
    this.socket.emit('leave_workspace', workspaceId);
  }

  onListDeleted(): Observable<TaskList> {
    return new Observable<TaskList>((observer) => {
      this.socket.on('delete_list', (list: TaskList) => {
        observer.next(list);
      });
    });
  }

  onFrameCreated(): Observable<Frame> {
    return new Observable<Frame>((observer) => {
      this.socket.on('show_new_workspace', (frame: Frame) => {
        observer.next(frame);
      });
    });
  }

  onCardDeleted(): Observable<Task> {
    return new Observable<Task>((observer) => {
      this.socket.on('delete_card', (card: Task) => {
        console.log('[SocketService] received delete_card', card);
        observer.next(card);
      });
    });
  }
}
