import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import {
  ActualizacionDisciplinarDto,
  CapacitacionDocenteDto,
  CreateUserDto,
  FormacionAcademicaDto,
  GestionAcademicaDto,
  ProductosAcademicosDto,
  UpdateUserDto,
} from '@interfaces/index';

import {
  addAcademicManagmentUseCase,
  addAcademicProductsUseCase,
  addAcademicTrainingUseCase,
  addDisciplinaryUpdateUseCase,
  addTeachingTrainingUseCase,
  changePasswordUseCase,
  createUserUseCase,
  getAllUsersUseCase,
  getUserUseCase,
  resetPasswordUseCase,
  updateAcademicManagmentUseCase,
  updateAcademicProductsUseCase,
  updateAcademicTrainingUseCase,
  updateDisciplinaryUpdateUseCase,
  updateTeachingTrainingUseCase,
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

  updateUserData(accessToken: string, user: UpdateUserDto) {
    return from(updateUserUseCase(accessToken, user));
  }

  changePassword(accessToken: string, newPassword: string) {
    return from(changePasswordUseCase(accessToken, newPassword));
  }

  resetPassword(accessToken: string, payrollNumber: string) {
    return from(resetPasswordUseCase(accessToken, payrollNumber));
  }

  addAcademicTrainingFunction(formacionAcademica: FormacionAcademicaDto) {
    return from(addAcademicTrainingUseCase(formacionAcademica));
  }

  addTeachingTrainingFunction(capacitacionDocente: CapacitacionDocenteDto) {
    return from(addTeachingTrainingUseCase(capacitacionDocente));
  }

  addDisciplinaryUpdateFunction(
    actualizacionDisciplinar: ActualizacionDisciplinarDto
  ) {
    return from(addDisciplinaryUpdateUseCase(actualizacionDisciplinar));
  }

  addAcademicManagmentFunction(gestionAcademicaDto: GestionAcademicaDto) {
    return from(addAcademicManagmentUseCase(gestionAcademicaDto));
  }

  addAcademicProductFunction(productosAcademicosDto: ProductosAcademicosDto) {
    return from(addAcademicProductsUseCase(productosAcademicosDto));
  }

  updateAcademicTrainingFunction(
    idFormacion: number,
    formacionAcademica: FormacionAcademicaDto
  ) {
    return from(updateAcademicTrainingUseCase(idFormacion, formacionAcademica));
  }

  updateTeachingTrainingFunction(
    idCapacitacion: number,
    capacitacionDocente: CapacitacionDocenteDto
  ) {
    return from(
      updateTeachingTrainingUseCase(idCapacitacion, capacitacionDocente)
    );
  }

  updateDisciplinaryUpdateFunction(
    idActualizacion: number,
    actualizacionDisciplinar: ActualizacionDisciplinarDto
  ) {
    return from(
      updateDisciplinaryUpdateUseCase(idActualizacion, actualizacionDisciplinar)
    );
  }

  updateAcademicManagmentFunction(
    idGestion: number,
    gestionAcademicaDto: GestionAcademicaDto
  ) {
    return from(updateAcademicManagmentUseCase(idGestion, gestionAcademicaDto));
  }

  updateAcademicProductFunction(
    idProducto: number,
    productosAcademicosDto: ProductosAcademicosDto
  ) {
    return from(
      updateAcademicProductsUseCase(idProducto, productosAcademicosDto)
    );
  }
}
