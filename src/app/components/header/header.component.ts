import { Component, EventEmitter, Output } from '@angular/core';
import { LucideAngularModule, PanelLeftClose, PanelLeftOpen, House, Bell, Settings, CircleUser } from 'lucide-angular';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule, MatIconButton, MatTooltip],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  readonly panelLeftClose = PanelLeftClose;
  readonly panelLeftOpen = PanelLeftOpen;
  readonly house = House;
  readonly bell = Bell;
  readonly settings = Settings;
  readonly circleUser = CircleUser;

  @Output() menuToggle = new EventEmitter<boolean>();

  isMenuOpen = true;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuToggle.emit(this.isMenuOpen);
  }
}
