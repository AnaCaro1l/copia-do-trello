import { Component, Input } from '@angular/core';
import { Frame } from '../../types/frame';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() frame: Frame | null = null;
}
