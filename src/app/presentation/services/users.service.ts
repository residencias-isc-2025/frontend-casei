import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import {
  CreateUserInterface,
  FormacionAcademicaInterface,
  NombreProfesorData,
} from '@interfaces/index';

import {
  addAcademicTrainingUseCase,
  addUserDataUseCase,
  createUserUseCase,
  getAllUsersUseCase,
  getUserDataUseCase,
  getUserUseCase,
  updateUserDataUseCase,
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

  addUserData(accessToken: string, user: NombreProfesorData) {
    return from(addUserDataUseCase(accessToken, user));
  }

  updateUserData(accessToken: string, user: NombreProfesorData) {
    return from(updateUserDataUseCase(accessToken, user));
  }

  addAcademicTrainingFunction(formacionAcademica: FormacionAcademicaInterface) {
    return from(addAcademicTrainingUseCase(formacionAcademica));
  }
}
