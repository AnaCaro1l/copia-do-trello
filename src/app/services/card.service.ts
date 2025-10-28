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
      .post<{ message: string; card: any }>(`${this.apiUrl}/card`, card)
      .pipe(
        map((res) => this.mapServerCardToTask(res.card))
      );
  }

  getCards(listId: number) {
    return this.http
      .get<{ message: string; cards: any[] }>(`${this.apiUrl}/cards/${listId}`)
      .pipe(
        map((res) => res.cards.map((c) => this.mapServerCardToTask(c)))
      );
  }

  getCardById(id: number) {
    return this.http
      .get<{ message: string; card: any }>(`${this.apiUrl}/card/${id}`)
      .pipe(map((res) => this.mapServerCardToTask(res.card)));
  }

  updateCard(id: number, card: Task) {
    const payload = this.mapTaskToServerCard(card);
    return this.http
      .put<{ message: string; card: any }>(`${this.apiUrl}/card/${id}`, payload)
      .pipe(map((res) => this.mapServerCardToTask(res.card)));
  }

  deleteCard(id: number) {
    return this.http.delete<Task>(`${this.apiUrl}/card/${id}`);
  }

  private mapServerCardToTask(card: any): Task {
    return {
      id: card.id,
      listId: card.listId,
      position: typeof card.position === 'number' ? card.position : undefined,
      title: card.title,
      createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
      updatedAt: card.updatedAt ? new Date(card.updatedAt) : new Date(),
      completed: !!card.completed,
      tags: card.tags ?? null, 
      dueDate: card.dueDate ? new Date(card.dueDate) : null,
      description: card.description ?? null,
      comments: card.comments ?? [],
      coverImageUrl: card.media ?? null,
      color: card.color ?? null,
    } as Task;
  }

  private mapTaskToServerCard(task: Task): any {
    return {
      title: task.title,
      description: task.description,
      listId: task.listId,
      position: typeof task.position === 'number' ? task.position : undefined,
      completed: task.completed,
      dueDate: task.dueDate,
      color: task.color,
    };
  }
}
