import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioMongoService } from '../usuario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leer-usuario',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './leer-usuario.component.html',
  styleUrls: ['./leer-usuario.component.css'],

})
export class LeerUsuarioComponent implements OnInit {
  usuarios: any[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private usuarioService: UsuarioMongoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    try {
      this.loading = true;
      this.error = '';
      const response: any = await this.usuarioService.getAllUsers();
      if (response) {
        this.usuarios = response;
      }
    } catch (error) {
      this.error = 'Error al cargar los usuarios';
      console.error('Error:', error);
    } finally {
      this.loading = false;
    }
  }

  editarUsuario(cedula: string) {
    this.router.navigate(['/actualizarUsuario', cedula]);
  }

  async eliminarUsuario(cedula: string) {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      try {
        await this.usuarioService.deleteUser(cedula);
        this.cargarUsuarios(); // Recargar la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  }

  nuevoUsuario() {
    this.router.navigate(['/insertarUsuario']);
  }

  filtroUsuario() {
    this.router.navigate(['/buscarUsuario']);
  }

  filtrarUsuario2() {
    this.router.navigate(['/filtroUsuario']);
  }

  // Método para formatear el teléfono si es necesario
  formatearTelefono(telefono: string): string {
    return telefono ? telefono : 'No disponible';
  }
}
