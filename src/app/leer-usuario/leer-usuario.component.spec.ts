import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeerUsuarioComponent } from './leer-usuario.component';

describe('LeerUsuarioComponent', () => {
  let component: LeerUsuarioComponent;
  let fixture: ComponentFixture<LeerUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeerUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeerUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
