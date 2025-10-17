import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Task } from '../types/task';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createCard(card: Task) {
    return this.http
      .post<{ message: string; card: Task }>(`${this.apiUrl}/card`, card)
      .pipe(map((res) => res.card));
  }

  getCards(listId: number) {
    return this.http
      .get<{ message: string; cards: Task[] }>(`${this.apiUrl}/cards/${listId}`)
      .pipe(map((res) => res.cards));
  }

  getCardById(id: number) {
    return this.http.get<Task>(`${this.apiUrl}/card/${id}`);
  }

  updateCard(id: number, card: Task) {
    return this.http.put<Task>(`${this.apiUrl}/card/${id}`, card);
  }

  deleteCard(id: number) {
    return this.http.delete<Task>(`${this.apiUrl}/card/${id}`);
  }
}
