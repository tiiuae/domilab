import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonPage } from './comparison.page';

describe('ComparisonComponent', () => {
  let component: ComparisonPage;
  let fixture: ComponentFixture<ComparisonPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComparisonPage]
    });
    fixture = TestBed.createComponent(ComparisonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
