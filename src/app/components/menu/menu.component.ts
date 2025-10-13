import { Component } from '@angular/core';
import { LucideAngularModule, LayoutDashboard, BookA } from 'lucide-angular';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  readonly layoutDashboard = LayoutDashboard;
  readonly bookA = BookA;
}
