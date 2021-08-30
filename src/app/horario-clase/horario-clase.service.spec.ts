import { TestBed } from '@angular/core/testing';

import { HorarioClaseService } from './horario-clase.service';

describe('HorarioClaseService', () => {
  let service: HorarioClaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioClaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
