import { Injectable } from '@angular/core';

import { CreateUserInterface } from '../../interfaces/dtos/create-user.dto';
import { FormacionAcademicaInterface } from '../../interfaces/dtos/formacion-academica.dto';

import { from } from 'rxjs';
import {
  addAcademicTrainingUseCase,
  createUserUseCase,
  getAllUsersUseCase,
  getUserUseCase,
} from '../../core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  createUser(user: CreateUserInterface) {
    return from(createUserUseCase(user));
  }

  getAllUsers(accessToken: string) {
    return from(getAllUsersUseCase(accessToken));
  }

  getLoggedUser(accessToken: string) {
    return from(getUserUseCase(accessToken));
  }

  addAcademicTrainingFunction(formacionAcademica: FormacionAcademicaInterface) {
    return from(addAcademicTrainingUseCase(formacionAcademica));
  }
}
