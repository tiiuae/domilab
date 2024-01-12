import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LccPlotComponent } from './lcc-plot.component';

describe('LccPlotComponent', () => {
  let component: LccPlotComponent;
  let fixture: ComponentFixture<LccPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LccPlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LccPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
