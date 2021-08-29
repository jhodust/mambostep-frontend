import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideleftbarComponent } from './sideleftbar.component';

describe('SideleftbarComponent', () => {
  let component: SideleftbarComponent;
  let fixture: ComponentFixture<SideleftbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideleftbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideleftbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
