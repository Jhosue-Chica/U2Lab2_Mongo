import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioMongoService {
  private url = 'http://localhost:3000/mongo/';

  constructor(private http: HttpClient) { }

  getUserByCedula(cedula: string) {
    console.log('Iniciando la búsqueda del usuario con cédula:', cedula);
    return new Promise((resolve) => {
      this.http.get(this.url + 'buscarUsuarioCedula/' + cedula)
        .subscribe({
          next: (data) => {
            console.log('Datos recibidos:', data);
            resolve(data);
          },
          error: (error) => {
            console.log('Error al buscar el usuario:', error);
            resolve(null);
          }
        });
    });
  }

  saveUser(data: any) {
    console.log('Guardando usuario:', data);
    return new Promise((resolve) => {
      this.http.post(this.url + 'insertarUsuario', data)
        .subscribe({
          next: (data) => {
            console.log('Usuario guardado:', data);
            resolve(data);
          },
          error: (error) => {
            console.log('Error al guardar el usuario:', error);
            resolve(null);
          }
        });
    });
  }

  getAllUsers() {
    console.log('Iniciando la búsqueda de todos los usuarios');
    return new Promise((resolve) => {
      this.http.get(this.url + 'leerUsuarios')
        .subscribe({
          next: (data) => {
            console.log('Datos recibidos:', data);
            resolve(data);
          },
          error: (error) => {
            console.log('Error al buscar los usuarios:', error);
            resolve(null);
          }
        });
    });
  }

  updateUser(cedula: string, data: any) {
    console.log('Actualizando usuario con cédula:', cedula);
    return new Promise((resolve) => {
      this.http.put(this.url + 'actualizarUsuario/' + cedula, data)
        .subscribe({
          next: (data) => {
            console.log('Usuario actualizado:', data);
            resolve(data);
          },
          error: (error) => {
            console.log('Error al actualizar el usuario:', error);
            resolve(null);
          }
        });
    });
  }

  deleteUser(cedula: string) {
    console.log('Eliminando usuario con cédula:', cedula);
    return new Promise((resolve) => {
      this.http.delete(this.url + 'eliminarUsuario/' + cedula)
        .subscribe({
          next: (data) => {
            console.log('Usuario eliminado:', data);
            resolve(data);
          },
          error: (error) => {
            console.log('Error al eliminar el usuario:', error);
            resolve(null);
          }
        });
    });
  }

  updateOrCreateUser(cedula: string, data: any) {
    console.log('Actualizando o creando usuario con cédula:', cedula);
    return new Promise((resolve) => {
      this.http.put(this.url + 'actualizarOCrearUsuario/' + cedula, data)
        .subscribe({
          next: (data) => {
            console.log('Usuario actualizado o creado:', data);
            resolve(data);
          },
          error: (error) => {
            console.log('Error al actualizar o crear el usuario:', error);
            resolve(null);
          }
        });
    });
  }

  filtrarUsuarios(campo: string, valor: string): Observable<any[]> {
    let params = new HttpParams()
      .set('campo', campo)
      .set('valor', valor);

    return this.http.get<any[]>(`${this.url}filtrarUsuarios`, { params });
  }

  busquedaAvanzada(criterios: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}busquedaAvanzada`, criterios);
  }
}
