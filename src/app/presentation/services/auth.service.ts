import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { loginUseCase } from '@core/index';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login(username: string, password: string) {
    return from(loginUseCase(username, password));
  }
}
