import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/enviroment.prod';
import { Observable, Subject } from 'rxjs';
import { TaskList } from '../types/tasklist';
import { Frame } from '../types/frame';
import { AuthService, AuthSession } from './auth.service';
import { Task } from '../types/task';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket: Socket;
  private listDeleted$ = new Subject<TaskList>();
  private frameCreated$ = new Subject<Frame>();
  private cardDeleted$ = new Subject<Task>();
  private cardCreated$ = new Subject<Task>();
  private cardUpdated$ = new Subject<Task>();
  private listCreated$ = new Subject<TaskList>();
  private listUpdated$ = new Subject<TaskList>();
  private frameUpdated$ = new Subject<Frame>();
  private frameDeleted$ = new Subject<number>();
  private inviteUpdated$ = new Subject<any>();

  constructor(private authService: AuthService) {
    this.socket = io(environment.apiUrl);

    this.socket.on('connect', () => {
      console.log('[SocketService] connected', this.socket.id);
      const user = this.getCurrentUser();
      if (user?.id) {
        this.joinUserRoom(user.id);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketService] disconnected', reason);
    });

    this.socket.on('delete_list', (list: TaskList) => {
      this.listDeleted$.next(list);
    });

    this.socket.on('show_new_workspace', (frame: Frame) => {
      this.frameCreated$.next(frame);
    });

    this.socket.on('delete_card', (card: Task) => {
      console.log('[SocketService] received delete_card', card);
      this.cardDeleted$.next(card);
    });

    this.socket.on('show_new_card', (card: Task) => {
      console.log('[SocketService] received show_new_card', card);
      this.cardCreated$.next(card);
    });

    this.socket.on('show_updated_card', (card: Task) => {
      console.log('[SocketService] received show_updated_card', card);
      this.cardUpdated$.next(card);
    });

    this.socket.on('show_new_list', (list: TaskList) => {
      console.log('[SocketService] received show_new_list', list);
      this.listCreated$.next(list);
    });

    this.socket.on('show_updated_list', (list: TaskList) => {
      console.log('[SocketService] received show_updated_list', list);
      this.listUpdated$.next(list);
    });

    this.socket.on('show_updated_workspace', (frame: Frame) => {
      console.log('[SocketService] received show_updated_workspace', frame);
      this.frameUpdated$.next(frame);
    });

    this.socket.on('delete_workspace', (frameId: number) => {
      console.log('[SocketService] received delete_workspace', frameId);
      this.frameDeleted$.next(frameId);
    });

    this.socket.on('validate_invite', (frameId: number) => {
      console.log('[SocketService] received validate_invite', frameId);
      this.inviteUpdated$.next(frameId);
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
    const user = this.getCurrentUser();
    if (user?.id) {
      this.joinUserRoom(user.id);
    }
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

  onListDeleted(): Observable<TaskList> { return this.listDeleted$.asObservable(); }

  onFrameCreated(): Observable<Frame> { return this.frameCreated$.asObservable(); }

  onCardDeleted(): Observable<Task> { return this.cardDeleted$.asObservable(); }

  onCardCreated(): Observable<Task> { return this.cardCreated$.asObservable(); }

  onCardUpdated(): Observable<Task> { return this.cardUpdated$.asObservable(); }

  onListCreated(): Observable<TaskList> { return this.listCreated$.asObservable(); }

  onListUpdated(): Observable<TaskList> { return this.listUpdated$.asObservable(); }

  onFrameUpdated(): Observable<Frame> { return this.frameUpdated$.asObservable(); }

  onFrameDeleted(): Observable<number> { return this.frameDeleted$.asObservable(); }

  onInviteUpdated(): Observable<number> { return this.inviteUpdated$.asObservable(); }
}
