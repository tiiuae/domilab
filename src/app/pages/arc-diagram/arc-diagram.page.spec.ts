import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcDiagramPage } from './arc-diagram.page';

describe('ArcDiagramComponent', () => {
  let component: ArcDiagramPage;
  let fixture: ComponentFixture<ArcDiagramPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArcDiagramPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArcDiagramPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
