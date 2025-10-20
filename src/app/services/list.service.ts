import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TaskList } from '../types/tasklist';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createList(list: TaskList): Observable<TaskList> {
    return this.http
      .post<{ message: string; list: TaskList }>(`${this.apiUrl}/list`, list)
      .pipe(map((res) => res.list));
  }

  getLists(workspaceId: number): Observable<TaskList[]> {
    return this.http
      .get<{ message: string; lists: TaskList[] }>(
        `${this.apiUrl}/lists/${workspaceId}`
      )
      .pipe(map((res) => res.lists));
  }

  getListById(id: number): Observable<TaskList> {
    return this.http
      .get<{ message: string; list: TaskList }>(`${this.apiUrl}/list/${id}`)
      .pipe(map((res) => res.list));
  }

  updateList(id: number, list: TaskList): Observable<TaskList> {
    return this.http
      .put<{ message: string; list: TaskList }>(`${this.apiUrl}/list/${id}`, list)
      .pipe(map((res) => res.list));
  }

  deleteList(id: number): Observable<TaskList> {
    // API returns 204 with message; we don't need the body
    return this.http.delete<TaskList>(`${this.apiUrl}/list/${id}`);
  }
}
