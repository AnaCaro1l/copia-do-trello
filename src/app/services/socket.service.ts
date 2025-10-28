import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/enviroment.prod';
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
      const handler = (card: Task) => {
        console.log('[SocketService] received delete_card', card);
        observer.next(card);
      };
      this.socket.on('delete_card', handler);
      return () => {
        this.socket.off('delete_card', handler);
      };
    });
  }

  // Cards
  onCardCreated(): Observable<Task> {
    return new Observable<Task>((observer) => {
      const handler = (card: Task) => {
        console.log('[SocketService] received show_new_card', card);
        observer.next(card);
      };
      this.socket.on('show_new_card', handler);
      return () => this.socket.off('show_new_card', handler);
    });
  }

  onCardUpdated(): Observable<Task> {
    return new Observable<Task>((observer) => {
      const handler = (card: Task) => {
        console.log('[SocketService] received show_updated_card', card);
        observer.next(card);
      };
      this.socket.on('show_updated_card', handler);
      return () => this.socket.off('show_updated_card', handler);
    });
  }

  // Lists
  onListCreated(): Observable<TaskList> {
    return new Observable<TaskList>((observer) => {
      const handler = (list: TaskList) => {
        console.log('[SocketService] received show_new_list', list);
        observer.next(list);
      };
      this.socket.on('show_new_list', handler);
      return () => this.socket.off('show_new_list', handler);
    });
  }

  onListUpdated(): Observable<TaskList> {
    return new Observable<TaskList>((observer) => {
      const handler = (list: TaskList) => {
        console.log('[SocketService] received show_updated_list', list);
        observer.next(list);
      };
      this.socket.on('show_updated_list', handler);
      return () => this.socket.off('show_updated_list', handler);
    });
  }

  // Frames (Workspaces)
  onFrameUpdated(): Observable<Frame> {
    return new Observable<Frame>((observer) => {
      const handler = (frame: Frame) => {
        console.log('[SocketService] received show_updated_workspace', frame);
        observer.next(frame);
      };
      this.socket.on('show_updated_workspace', handler);
      return () => this.socket.off('show_updated_workspace', handler);
    });
  }

  onFrameDeleted(): Observable<number> {
    return new Observable<number>((observer) => {
      const handler = (frameId: number) => {
        console.log('[SocketService] received delete_workspace', frameId);
        observer.next(frameId);
      };
      this.socket.on('delete_workspace', handler);
      return () => this.socket.off('delete_workspace', handler);
    });
  }
}
