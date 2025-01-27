import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroUsuarioComponent } from './filtro-usuario.component';

describe('FiltroUsuarioComponent', () => {
  let component: FiltroUsuarioComponent;
  let fixture: ComponentFixture<FiltroUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltroUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
