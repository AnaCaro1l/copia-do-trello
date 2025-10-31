import { Component, Input, OnInit } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../../components/header/header.component';
import { MessageService } from 'primeng/api';
import { FrameComponent } from '../../components/frame/frame.component';
import { ActivatedRoute } from '@angular/router'; 
import { WorkspaceService } from '../../services/workspace.service';
import { Frame } from '../../types/frame';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ToastModule, HeaderComponent, FrameComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [MessageService],
})
export class DashboardComponent implements OnInit {
  @Input() isMenuOpen: boolean = true;

  frame!: Frame;

  constructor(
    private workspaceService: WorkspaceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('frameId');
      if (id) {
        this.getFrameData(Number(id));
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getFrameData(frameId: number) {
    this.workspaceService.getWorkspaceById(frameId).subscribe({
      next: (frame: Frame) => {
        this.frame = frame;
      },
      error: (err) => {
        console.error('Error fetching frame data:', err);
      },
    });
  }
}
