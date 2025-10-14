import { Injectable } from '@angular/core';
// import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  //  socket: Socket | null = null;
  // constructor() {
  //   this.socket = io(this.apiUrl, {});

  //   this.socket.on('connect', () => {
  //     console.log('Conectado ao servidor', this.socket?.id);
  //   });

  //   this.socket.on('disconnect', (reason) => {
  //     console.log('Desconectado do servidor:', reason);
  //   });
  // }

  // listen(event: string, callback: (data: any) => void) {
  //   this.socket?.on(event, callback);
  // }

  // disconnect() {
  //   console.log(this.socket);
  //   if (this.socket) {
  //     this.socket.disconnect();
  //   }
  // }
}
