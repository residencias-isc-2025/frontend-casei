import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { tap } from 'rxjs';

interface LoginResponse {
  mensaje: string;
  tokens: Tokens;
}

interface Tokens {
  refresh: string;
  access: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = signal<string | null>(
    localStorage.getItem('casei_residencias_access_token')
  );

  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/login/`;

  login(username: string, password: string) {
    return this.http
      .post<LoginResponse>(this.apiUrl, {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(
            'casei_residencias_access_token',
            res.tokens.access
          );
          this.token.set(res.tokens.access);
        })
      );
  }

  logout() {
    localStorage.removeItem('casei_residencias_access_token');
    this.token.set(null);
  }

  getToken() {
    return this.token();
  }
}
