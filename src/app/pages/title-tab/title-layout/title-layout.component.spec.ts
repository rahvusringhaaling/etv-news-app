import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleLayoutComponent } from './title-layout.component';

describe('TitleLayoutComponent', () => {
  let component: TitleLayoutComponent;
  let fixture: ComponentFixture<TitleLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitleLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
