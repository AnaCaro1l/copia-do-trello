import { Component, Input, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { HeaderComponent } from '../../components/header/header.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Clock } from 'lucide-angular';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';
import { CardComponent } from '../../components/card/card.component';
import { DefaultCardComponent } from '../../components/default-card/default-card.component';
import { WorkspaceService } from '../../services/workspace.service';
import { Frame } from '../../types/frame';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    MenuComponent,
    CommonModule,
    LucideAngularModule,
    ToastModule,
    CardComponent,
    DefaultCardComponent,
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
export class HomeComponent implements OnInit {
  readonly clock = Clock;
  @Input() isMenuOpen: boolean = true;

  frames: Frame[] = [];

  constructor(
    private router: Router,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit() {
    this.workspaceService.getWorkspaces().subscribe({
      next: (response: any) => {
        this.frames = response.workspaces;
      },
      error: (err) => {
        console.error('Erro ao buscar workspaces:', err);
        this.frames = [];
      },
    });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onCardClick(frameId?: number) {
    // if frameId is not provided, do nothing
    if (!frameId) return;
    // navigate to dashboard using path param: /dashboard/:frameId
    this.router.navigate(['/dashboard', frameId]);
  }
}
