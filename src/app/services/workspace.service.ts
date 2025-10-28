import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Frame } from '../types/frame';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createWorkspace(data: Partial<Frame> & { backgroundUrl?: File | string | null }): Observable<Frame> {
  const hasFile = !!data && !!data.backgroundUrl && typeof data.backgroundUrl !== 'string';

    if (hasFile) {
      const form = new FormData();
      if (data.name !== undefined) form.append('name', String(data.name));
      if (data.visibility !== undefined) form.append('visibility', String(Number(data.visibility)));
      if (data.backgroundColor != null) form.append('backgroundColor', String(data.backgroundColor));
      form.append('backgroundPath', data.backgroundUrl as File);

      return this.http
        .post<{ message: string; workspace: Frame }>(`${this.apiUrl}/workspace`, form)
        .pipe(map((res) => res.workspace));
    }

    return this.http
      .post<{ message: string; workspace: Frame }>(`${this.apiUrl}/workspace`, data)
      .pipe(map((res) => res.workspace));
  }

  getWorkspaces(): Observable<Frame[]> {
    return this.http
      .get<{ message: string; workspaces: Frame[] }>(`${this.apiUrl}/workspaces`)
      .pipe(map((res) => res.workspaces));
  }

  getWorkspaceById(id: number): Observable<Frame> {
    return this.http
      .get<{ message: string; workspace: Frame }>(`${this.apiUrl}/workspace/${id}`)
      .pipe(map((res) => res.workspace));
  }

  updateWorkspace(id: number, data: Partial<Frame> & { backgroundUrl?: File | string | null }): Observable<Frame> {
  const hasFile = !!data && !!data.backgroundUrl && typeof data.backgroundUrl !== 'string';

    if (hasFile) {
      const form = new FormData();
      if (data.name !== undefined) form.append('name', String(data.name));
      if (data.visibility !== undefined) form.append('visibility', String(Number(data.visibility)));
      if (data.backgroundColor != null) form.append('backgroundColor', String(data.backgroundColor));
      form.append('backgroundPath', data.backgroundUrl as File);

      return this.http
        .put<{ message: string; workspace: Frame }>(`${this.apiUrl}/workspace/${id}`, form)
        .pipe(map((res) => res.workspace));
    }

    return this.http
      .put<{ message: string; workspace: Frame }>(`${this.apiUrl}/workspace/${id}`, data)
      .pipe(map((res) => res.workspace));
  }

  deleteWorkspace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/workspace/${id}`);
  }
}
 