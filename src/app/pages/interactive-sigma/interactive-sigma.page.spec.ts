import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveSigmaPage } from './interactive-sigma.page';

describe('InteractiveSigmaComponent', () => {
  let component: InteractiveSigmaPage;
  let fixture: ComponentFixture<InteractiveSigmaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractiveSigmaPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractiveSigmaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
