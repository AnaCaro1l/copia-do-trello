import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { HeaderComponent } from '../../components/header/header.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Clock } from 'lucide-angular';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    MenuComponent,
    CommonModule,
    LucideAngularModule,
    CardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('menuAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-250px)' }),
        animate(
          '300ms ease-in-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in-out',
          style({ opacity: 0, transform: 'translateX(-250px)' })
        ),
      ]),
    ]),
  ],
})
export class HomeComponent {
  readonly clock = Clock;
  @Input() isMenuOpen: boolean = true;
  @Input() profileOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
