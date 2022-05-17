import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoLayoutComponent } from './info-layout.component';

describe('SettingsLayoutComponent', () => {
  let component: InfoLayoutComponent;
  let fixture: ComponentFixture<InfoLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
