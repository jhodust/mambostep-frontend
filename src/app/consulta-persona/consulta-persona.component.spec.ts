import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaPersonaComponent } from './consulta-persona.component';

describe('ConsultaPersonaComponent', () => {
  let component: ConsultaPersonaComponent;
  let fixture: ComponentFixture<ConsultaPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaPersonaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
