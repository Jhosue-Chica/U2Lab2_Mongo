import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioMongoService } from '../usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actualizar-usuario',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './actualizar-usuario.component.html',
  styleUrls: ['./actualizar-usuario.component.css']
})
export class ActualizarUsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  loading: boolean = false;
  loadingData: boolean = true;
  error: string = '';
  submitAttempt: boolean = false;
  cedula: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioMongoService,
    private router: Router,
    private route: ActivatedRoute
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
    this.cedula = this.route.snapshot.paramMap.get('cedula') || '';
    if (this.cedula) {
      this.cargarDatosUsuario();
    } else {
      this.router.navigate(['/leerUsuarios']);
    }
  }

  async cargarDatosUsuario() {
    try {
      this.loadingData = true;
      const usuario: any = await this.usuarioService.getUserByCedula(this.cedula);

      if (usuario) {
        this.usuarioForm.patchValue({
          nombreusuario: usuario.nombreusuario,
          cedulausuario: usuario.cedulausuario,
          telefonousuario: usuario.telefonousuario,
          direccionusuario: usuario.direccionusuario,
          correousuario: usuario.correousuario
        });
      } else {
        this.error = 'Usuario no encontrado';
        setTimeout(() => {
          this.router.navigate(['/leerUsuarios']);
        }, 3000);
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      this.error = 'Error al cargar los datos del usuario';
    } finally {
      this.loadingData = false;
    }
  }

  get f() {
    return this.usuarioForm.controls;
  }

  async onSubmit() {
    this.submitAttempt = true;

    if (this.usuarioForm.valid) {
      try {
        this.loading = true;
        this.error = '';

        await this.usuarioService.updateUser(this.cedula, this.usuarioForm.value);
        this.router.navigate(['/leerUsuarios']);
      } catch (error) {
        console.error('Error al actualizar:', error);
        this.error = 'Error al actualizar el usuario';
      } finally {
        this.loading = false;
      }
    } else {
      Object.keys(this.f).forEach(key => {
        const control = this.usuarioForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  resetForm() {
    this.cargarDatosUsuario();
    this.submitAttempt = false;
    this.error = '';
  }

  cancelar() {
    this.router.navigate(['/leerUsuarios']);
  }

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
