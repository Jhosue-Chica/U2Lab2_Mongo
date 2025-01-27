import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { UsuarioMongoService } from '../usuario.service';
import { CommonModule } from '@angular/common';

interface Usuario {
  nombreusuario: string;
  cedulausuario: string;
  telefonousuario: string;
  direccionusuario: string;
  correousuario: string;
}

@Component({
  selector: 'app-filtro-usuario',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filtro-usuario.component.html',
  styleUrls: ['./filtro-usuario.component.css']
})
export class FiltroUsuarioComponent implements OnInit, OnDestroy {
  // Arrays y estados
  usuarios: Usuario[] = [];
  loading: boolean = false;
  error: string = '';
  mostrarBusquedaAvanzada: boolean = false;

  // Subject para manejar la limpieza de suscripciones
  private destroy$ = new Subject<void>();

  // Formularios
  searchForm: FormGroup;
  busquedaAvanzadaForm: FormGroup;

  // Opciones de campos para el filtro
  camposFiltro = [
    { value: 'todos', label: 'Todos los campos' },
    { value: 'nombreusuario', label: 'Nombre' },
    { value: 'cedulausuario', label: 'Cédula' },
    { value: 'telefonousuario', label: 'Teléfono' },
    { value: 'direccionusuario', label: 'Dirección' },
    { value: 'correousuario', label: 'Correo' }
  ];

  constructor(
    private usuarioService: UsuarioMongoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Inicializar formulario de búsqueda simple
    this.searchForm = this.fb.group({
      campo: ['todos'],
      valor: ['']
    });

    // Inicializar formulario de búsqueda avanzada
    this.busquedaAvanzadaForm = this.fb.group({
      nombreusuario: [''],
      cedulausuario: [''],
      telefonousuario: [''],
      direccionusuario: [''],
      correousuario: ['']
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.setupSearchSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchSubscriptions(): void {
    // Suscripción para búsqueda simple
    this.searchForm.get('valor')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.realizarBusquedaSimple();
    });

    // Suscripción para cambio de campo en búsqueda simple
    this.searchForm.get('campo')?.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const valorActual = this.searchForm.get('valor')?.value;
      if (valorActual) {
        this.realizarBusquedaSimple();
      }
    });

    // Suscripción para búsqueda avanzada
    this.busquedaAvanzadaForm.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.mostrarBusquedaAvanzada) {
        this.realizarBusquedaAvanzada();
      }
    });
  }

  async cargarUsuarios(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';
      const response = await this.usuarioService.getAllUsers();
      if (response) {
        this.usuarios = response as Usuario[];
      }
    } catch (error) {
      this.error = 'Error al cargar los usuarios';
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  realizarBusquedaSimple(): void {
    const { campo, valor } = this.searchForm.value;
    if (!valor?.trim()) {
      this.cargarUsuarios();
      return;
    }

    this.loading = true;
    this.error = '';

    this.usuarioService.filtrarUsuarios(campo, valor).subscribe({
      next: (response) => {
        this.usuarios = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en la búsqueda:', error);
        this.error = 'Error al realizar la búsqueda';
        this.loading = false;
      }
    });
  }

  realizarBusquedaAvanzada(): void {
    const criterios = this.busquedaAvanzadaForm.value;

    // Eliminar criterios vacíos
    Object.keys(criterios).forEach(key => {
      if (!criterios[key]?.trim()) {
        delete criterios[key];
      }
    });

    if (Object.keys(criterios).length === 0) {
      this.cargarUsuarios();
      return;
    }

    this.loading = true;
    this.error = '';

    this.usuarioService.busquedaAvanzada(criterios).subscribe({
      next: (response) => {
        this.usuarios = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en la búsqueda avanzada:', error);
        this.error = 'Error al realizar la búsqueda avanzada';
        this.loading = false;
      }
    });
  }

  toggleBusquedaAvanzada(): void {
    this.mostrarBusquedaAvanzada = !this.mostrarBusquedaAvanzada;
    if (!this.mostrarBusquedaAvanzada) {
      this.busquedaAvanzadaForm.reset();
      if (!this.searchForm.get('valor')?.value) {
        this.cargarUsuarios();
      }
    } else {
      this.searchForm.get('valor')?.reset();
      this.cargarUsuarios();
    }
  }

  limpiarFiltros(): void {
    if (this.mostrarBusquedaAvanzada) {
      this.busquedaAvanzadaForm.reset();
    } else {
      this.searchForm.patchValue({ valor: '' });
    }
    this.cargarUsuarios();
  }

  nuevoUsuario(): void {
    this.router.navigate(['/crear-usuario']);
  }

  editarUsuario(cedula: string): void {
    this.router.navigate(['/editar-usuario', cedula]);
  }

  async eliminarUsuario(cedula: string): Promise<void> {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      try {
        await this.usuarioService.deleteUser(cedula);
        this.cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        this.error = 'Error al eliminar el usuario';
      }
    }
  }

  formatearTelefono(telefono: string): string {
    if (!telefono) return 'No disponible';
    // Formato: (XXX) XXX-XXXX
    const cleaned = telefono.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return telefono;
  }
}
