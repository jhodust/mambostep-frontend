import { TestBed } from '@angular/core/testing';

import { MensualidadService } from './mensualidad.service';

describe('MensualidadService', () => {
  let service: MensualidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensualidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
