import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UIStateService {
  private cardDialogOpenSubject = new BehaviorSubject<boolean>(false);
  readonly cardDialogOpen$ = this.cardDialogOpenSubject.asObservable();

  setCardDialogOpen(open: boolean): void {
    this.cardDialogOpenSubject.next(open);
  }
}
