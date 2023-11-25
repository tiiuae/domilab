import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAttacksPage } from './network-attacks.page';

describe('NetworkAttacksPage', () => {
  let component: NetworkAttacksPage;
  let fixture: ComponentFixture<NetworkAttacksPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkAttacksPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkAttacksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
