import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root'
})
export class InviteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private workspaceService: WorkspaceService) { }

  addCollaborators(workspaceId: number, emails: string[]) {
    return this.http
      .post<{ message: string; invite: any }>(`${this.apiUrl}/workspace/collaborators`, { workspaceId, emails })
      .pipe(map((res) => res.invite));
  }
  listInvites() {
    return this.http
      .get<{ message: string; invites: any[] }>(`${this.apiUrl}/invites`)
      .pipe(map((res) => res.invites));
  }

  showInvite(id: number) {
    return this.http
      .get<{ message: string; invite: any }>(`${this.apiUrl}/invite/${id}`)
      .pipe(map((res) => res.invite));
  }

  validateInvite(status: string, inviteId: number) {
    // Backend returns { message, invite }, not { valid }
    return this.http
      .post<{ message: string; invite: any }>(`${this.apiUrl}/invite/validate`, { status, inviteId })
      .pipe(map((res) => res.invite));
  }

}
