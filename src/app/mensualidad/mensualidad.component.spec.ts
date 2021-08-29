import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensualidadComponent } from './mensualidad.component';

describe('MensualidadComponent', () => {
  let component: MensualidadComponent;
  let fixture: ComponentFixture<MensualidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensualidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensualidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
