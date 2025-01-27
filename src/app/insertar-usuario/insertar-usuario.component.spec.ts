import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertarUsuarioComponent } from './insertar-usuario.component';

describe('InsertarUsuarioComponent', () => {
  let component: InsertarUsuarioComponent;
  let fixture: ComponentFixture<InsertarUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertarUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertarUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
