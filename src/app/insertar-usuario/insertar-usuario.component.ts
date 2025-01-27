import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioMongoService } from '../usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insertar-usuario',
  imports: [ FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './insertar-usuario.component.html',
  styleUrls: ['./insertar-usuario.component.css']
})
export class InsertarUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  loading: boolean = false;
  error: string = '';
  submitAttempt: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioMongoService,
    private router: Router
  ) {
    this.usuarioForm = this.fb.group({
      nombreusuario: ['', [Validators.required, Validators.minLength(3)]],
      cedulausuario: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      telefonousuario: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      direccionusuario: ['', Validators.required],
      correousuario: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
  }

  // Getter para facilitar el acceso a los controles del formulario en el template
  get f() {
    return this.usuarioForm.controls;
  }

  async onSubmit() {
    this.submitAttempt = true;

    if (this.usuarioForm.valid) {
      try {
        this.loading = true;
        this.error = '';

        // Verificar si ya existe un usuario con la misma cédula
        const usuarioExistente: any = await this.usuarioService.getUserByCedula(this.f['cedulausuario'].value);

        if (usuarioExistente) {
          this.error = 'Ya existe un usuario con esta cédula';
          return;
        }

        await this.usuarioService.saveUser(this.usuarioForm.value);
        this.router.navigate(['/leerUsuarios']);
      } catch (error) {
        console.error('Error al guardar:', error);
        this.error = 'Error al guardar el usuario';
      } finally {
        this.loading = false;
      }
    } else {
      // Marcar todos los campos como touched para mostrar los errores
      Object.keys(this.f).forEach(key => {
        const control = this.usuarioForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  // Método para reiniciar el formulario
  resetForm() {
    this.usuarioForm.reset();
    this.submitAttempt = false;
    this.error = '';
  }

  // Método para cancelar y volver a la lista
  cancelar() {
    this.router.navigate(['/leerUsuarios']);
  }

  // Métodos para validación de campos
  getErrorMessage(controlName: string): string {
    const control = this.f[controlName];

    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (control.hasError('email')) {
      return 'Debe ingresar un correo válido';
    }

    if (control.hasError('pattern')) {
      if (controlName === 'cedulausuario') {
        return 'La cédula debe tener 10 dígitos';
      }
      if (controlName === 'telefonousuario') {
        return 'El teléfono debe tener 10 dígitos';
      }
    }

    if (control.hasError('minlength')) {
      return `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    }

    return '';
  }
}
