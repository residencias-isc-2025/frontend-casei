import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import {
  CreateUserInterface,
  FormacionAcademicaInterface,
} from '@interfaces/index';

import {
  addAcademicTrainingUseCase,
  createUserUseCase,
  getAllUsersUseCase,
  getUserDataUseCase,
  getUserUseCase,
} from '@core/index';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  getUserRole(): string {
    return localStorage.getItem('user-role') || 'user';
  }

  createUser(user: CreateUserInterface) {
    return from(createUserUseCase(user));
  }

  getAllUsers(accessToken: string) {
    return from(getAllUsersUseCase(accessToken));
  }

  getLoggedUser(accessToken: string) {
    return from(getUserUseCase(accessToken));
  }

  getUserData(accessToken: string) {
    return from(getUserDataUseCase(accessToken));
  }

  addAcademicTrainingFunction(formacionAcademica: FormacionAcademicaInterface) {
    return from(addAcademicTrainingUseCase(formacionAcademica));
  }
}
