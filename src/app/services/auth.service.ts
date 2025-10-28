import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id?: number;
  name: string;
  email: string;
  password?: string;
}

export interface AuthSession {
  token?: string;
  user: AuthUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private readonly STORAGE_KEY = 'currentUser';

  private sessionSubject = new BehaviorSubject<AuthSession | null>(this.readFromStorage());
  session$ = this.sessionSubject.asObservable();

  get sessionValue(): AuthSession | null {
    return this.sessionSubject.value;
  }

  setSession(session: AuthSession) {
    this.writeToStorage(session);
    this.sessionSubject.next(session);
  }

  updateUser(user: Partial<AuthUser>) {
    const current = this.sessionSubject.value;
    if (!current) return;
    const updated: AuthSession = {
      ...current,
      user: { ...current.user, ...user },
    };
    this.setSession(updated);
  }

  clearSession() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (_) {}
    this.sessionSubject.next(null);
  }

  private readFromStorage(): AuthSession | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const user: AuthUser | undefined = parsed.user || parsed.updatedUser || parsed;
      if (!user) return null;
      return { token: parsed.token, user } as AuthSession;
    } catch (_) {
      return null;
    }
  }

  private writeToStorage(session: AuthSession) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    } catch (_) {}
  }
}
