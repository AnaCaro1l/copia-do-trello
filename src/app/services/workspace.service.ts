import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Frame } from '../types/frame';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createWorkspace(workspace: Frame): Observable<Frame> {
    return this.http.post<Frame>(`${this.apiUrl}/workspace`, workspace);
  }

  getWorkspaces(): Observable<Frame[]> {
    return this.http.get<Frame[]>(`${this.apiUrl}/workspaces`);
  }

  getWorkspaceById(id: number): Observable<Frame> {
    return this.http.get<Frame>(`${this.apiUrl}/workspace/${id}`);
  }

  updateWorkspace(id: number, data: Partial<Frame>): Observable<Frame> {
    return this.http.put<Frame>(`${this.apiUrl}/workspace/${id}`, data);
  }

  deleteWorkspace(id: number): Observable<Frame> {
    return this.http.delete<Frame>(`${this.apiUrl}/workspace/${id}`);
  }
}
 