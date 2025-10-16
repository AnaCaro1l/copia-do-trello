import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListDefaultComponent } from './task-list-default.component';

describe('TaskListDefaultComponent', () => {
  let component: TaskListDefaultComponent;
  let fixture: ComponentFixture<TaskListDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListDefaultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskListDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
