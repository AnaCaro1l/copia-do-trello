import { Component, Input } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../../components/header/header.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ToastModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [MessageService],  
})
export class DashboardComponent {
  @Input() isMenuOpen: boolean = true;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
