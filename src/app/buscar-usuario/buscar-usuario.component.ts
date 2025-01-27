import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsuarioMongoService } from '../usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buscar-usuario',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './buscar-usuario.component.html',
  styleUrls: ['./buscar-usuario.component.css']
})
export class BuscarUsuarioComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  loading: boolean = false;
  error: string = '';
  searchControl = new FormControl('');
  selectedField = new FormControl('todos');

  // Campos disponibles para filtrar
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
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.setupSearchSubscription();
  }

  private setupSearchSubscription() {
    // Configurar el observable para el filtro con debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Esperar 300ms después de la última entrada
      distinctUntilChanged() // Solo emitir si el valor ha cambiado
    ).subscribe(searchTerm => {
      this.filtrarUsuarios(searchTerm || '');
    });

    // Suscribirse a cambios en el campo seleccionado
    this.selectedField.valueChanges.subscribe(() => {
      this.filtrarUsuarios(this.searchControl.value || '');
    });
  }

  async cargarUsuarios() {
    try {
      this.loading = true;
      this.error = '';
      const response: any = await this.usuarioService.getAllUsers();
      if (response) {
        this.usuarios = response;
        this.usuariosFiltrados = [...this.usuarios];
      }
    } catch (error) {
      this.error = 'Error al cargar los usuarios';
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  filtrarUsuarios(searchTerm: string) {
    if (!searchTerm) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    searchTerm = searchTerm.toLowerCase().trim();
    const campo = this.selectedField.value;

    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      if (campo === 'todos') {
        // Buscar en todos los campos
        return Object.values(usuario).some(value =>
          value && value.toString().toLowerCase().includes(searchTerm)
        );
      } else {
        // Buscar en el campo específico
        const valorCampo = campo ? usuario[campo] : null;
        return valorCampo &&
               valorCampo.toString().toLowerCase().includes(searchTerm);
      }
    });
  }

  limpiarFiltro() {
    this.searchControl.setValue('');
    this.selectedField.setValue('todos');
    this.usuariosFiltrados = [...this.usuarios];
  }

  editarUsuario(cedula: string) {
    this.router.navigate(['/editarUsuario', cedula]);
  }

  async eliminarUsuario(cedula: string) {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      try {
        await this.usuarioService.deleteUser(cedula);
        await this.cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  }

  nuevoUsuario() {
    this.router.navigate(['/insertarUsuario']);
  }

  formatearTelefono(telefono: string): string {
    return telefono ? telefono : 'No disponible';
  }
}
