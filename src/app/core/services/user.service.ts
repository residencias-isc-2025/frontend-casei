import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { User } from '@core/models/user.model';
import { environment } from '@environments/environment';

export interface UserSearchParams {
  nomina?: string;
  nombre?: string;
  estado?: string;
  area?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<User> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/usuarios`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: UserSearchParams
  ) {
    let url = `${this.apiUrl}/users/?page=${page}&page_size=${limit}`;

    if (params.nomina !== '') url += `&username=${params.nomina}`;
    if (params.nombre !== '') url += `&nombre=${params.nombre}`;
    if (params.area !== '') url += `&area_adscripcion=${params.area}`;
    if (params.estado !== '') url += `&estado=${params.estado}`;

    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: User[];
    }>(url);
  }

  obtenerPerfil() {
    return this.http.get<User>(`${this.apiUrl}/profile/`);
  }

  override crear(data: Partial<User>) {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/register/`,
      data
    );
  }

  crearUsuariosPorCsv(formData: FormData) {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/create-users-by-csv/`,
      formData
    );
  }

  reestablecerPassword(id: number) {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/reset-password/${id}/`,
      {}
    );
  }

  override deshabilitar(id: number) {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/register/${id}/`
    );
  }

  override habilitar(id: number) {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/habilitar-usuario/${id}/`,
      {}
    );
  }

  cambiarPassword(newPassword: string) {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/change-password/`,
      {
        new_password: newPassword,
      }
    );
  }

  override actualizar(id: number, data: Partial<User>) {
    return this.http.put<{ mensaje: string; data: User }>(
      `${this.apiUrl}/register/${id}/`,
      data
    );
  }

  override obtenerDataInfo(id: number, lista: User[]): User | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }

  obtenerRolUsuario() {
    return localStorage.getItem('user-role') || 'user';
  }

  limpiarRol(role: string): string {
    return role === 'superuser'
      ? 'Super usuario'
      : role === 'admin'
      ? 'Administrador'
      : 'Docente';
  }
}
