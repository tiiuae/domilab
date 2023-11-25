import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcDiagramComponent } from './arc-diagram.component';

describe('ArcDiagramComponent', () => {
  let component: ArcDiagramComponent;
  let fixture: ComponentFixture<ArcDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArcDiagramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArcDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
