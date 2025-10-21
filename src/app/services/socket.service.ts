import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { TaskList } from '../types/tasklist';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: Socket;
  
  constructor() { 
    this.socket = io(environment.apiUrl);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinWorkspace(workspaceId: number): void {
    this.socket.emit('join_workspace', workspaceId);
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
}
