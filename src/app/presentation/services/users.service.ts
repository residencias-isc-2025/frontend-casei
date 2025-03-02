import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import {
  CreateUserDto,
  FormacionAcademicaDto,
  UpdateUserDto,
} from '@interfaces/index';

import {
  addAcademicTrainingUseCase,
  createUserUseCase,
  getAllUsersUseCase,
  getUserUseCase,
  updateUserUseCase,
} from '@core/index';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  getUserRole(): string {
    return localStorage.getItem('user-role') || 'user';
  }

  createUser(user: CreateUserDto) {
    return from(createUserUseCase(user));
  }

  getAllUsers(accessToken: string) {
    return from(getAllUsersUseCase(accessToken));
  }

  getLoggedUser(accessToken: string) {
    return from(getUserUseCase(accessToken));
  }

  addAcademicTrainingFunction(formacionAcademica: FormacionAcademicaDto) {
    return from(addAcademicTrainingUseCase(formacionAcademica));
  }

  updateUserData(accessToken: string, user: UpdateUserDto) {
    return from(updateUserUseCase(accessToken, user));
  }
}
