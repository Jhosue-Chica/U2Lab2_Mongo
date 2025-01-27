import { Routes } from '@angular/router';
import { BuscarUsuarioComponent } from './buscar-usuario/buscar-usuario.component';
import { InsertarUsuarioComponent } from './insertar-usuario/insertar-usuario.component';
import { ActualizarUsuarioComponent } from './actualizar-usuario/actualizar-usuario.component';
import { LeerUsuarioComponent } from './leer-usuario/leer-usuario.component';
import { EliminarUsuarioComponent } from './eliminar-usuario/eliminar-usuario.component';
import { FiltroUsuarioComponent } from './filtro-usuario/filtro-usuario.component';

export const routes: Routes = [
  {path: '', redirectTo: 'leerUsuarios', pathMatch: 'full'},
  {path: 'buscarUsuario', component: BuscarUsuarioComponent, pathMatch: 'full'},
  {path: 'insertarUsuario', component: InsertarUsuarioComponent, pathMatch: 'full'},
  {path: 'leerUsuarios', component: LeerUsuarioComponent, pathMatch: 'full', },
  {path: 'actualizarUsuario/:cedula', component: ActualizarUsuarioComponent },
  {path: 'eliminarUsuario/:cedula', component: EliminarUsuarioComponent, pathMatch: 'full'},
  {path: 'inspeccionarUsuario/:cedula', component:InsertarUsuarioComponent, pathMatch: 'full'},
  {path: 'filtroUsuario', component: FiltroUsuarioComponent, pathMatch: 'full', },
];
