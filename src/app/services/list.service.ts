import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TaskList } from '../types/tasklist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createList(list: TaskList): Observable<TaskList> {
    return this.http.post<TaskList>(`${this.apiUrl}/list`, list);
  }

  getLists(workspaceId: number): Observable<TaskList[]> {
    return this.http.get<TaskList[]>(`${this.apiUrl}/lists?workspaceId=${workspaceId}`);
  }

  getListById(id: number): Observable<TaskList> {
    return this.http.get<TaskList>(`${this.apiUrl}/list/${id}`);
  }

  updateList(id: number, list: TaskList): Observable<TaskList> {
    return this.http.put<TaskList>(`${this.apiUrl}/list/${id}`, list);
  }

  deleteList(id: number): Observable<TaskList> {
    return this.http.delete<TaskList>(`${this.apiUrl}/list/${id}`);
  }
}
