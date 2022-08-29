import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasparComponent } from './caspar.component';

describe('CasparComponent', () => {
  let component: CasparComponent;
  let fixture: ComponentFixture<CasparComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasparComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasparComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
