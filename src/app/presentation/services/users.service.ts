import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import {
  ActualizacionDisciplinarDto,
  CapacitacionDocenteDto,
  CreateUserDto,
  ExperienciaProfesionalDto,
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
  addProfessionalExperienceUseCase,
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
  updateProfessionalExperienceUseCase,
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

  //#region Formación académica
  addAcademicTrainingFunction(formacionAcademica: FormacionAcademicaDto) {
    return from(addAcademicTrainingUseCase(formacionAcademica));
  }

  updateAcademicTrainingFunction(
    idFormacion: number,
    formacionAcademica: FormacionAcademicaDto
  ) {
    return from(updateAcademicTrainingUseCase(idFormacion, formacionAcademica));
  }
  //#endregion

  //#region Capacitación docente
  addTeachingTrainingFunction(capacitacionDocente: CapacitacionDocenteDto) {
    return from(addTeachingTrainingUseCase(capacitacionDocente));
  }

  updateTeachingTrainingFunction(
    idCapacitacion: number,
    capacitacionDocente: CapacitacionDocenteDto
  ) {
    return from(
      updateTeachingTrainingUseCase(idCapacitacion, capacitacionDocente)
    );
  }
  //#endregion

  //#region Actualización disciplinar
  addDisciplinaryUpdateFunction(
    actualizacionDisciplinar: ActualizacionDisciplinarDto
  ) {
    return from(addDisciplinaryUpdateUseCase(actualizacionDisciplinar));
  }

  updateDisciplinaryUpdateFunction(
    idActualizacion: number,
    actualizacionDisciplinar: ActualizacionDisciplinarDto
  ) {
    return from(
      updateDisciplinaryUpdateUseCase(idActualizacion, actualizacionDisciplinar)
    );
  }
  //#endregion

  //#region Gestión académica
  addAcademicManagmentFunction(gestionAcademicaDto: GestionAcademicaDto) {
    return from(addAcademicManagmentUseCase(gestionAcademicaDto));
  }

  updateAcademicManagmentFunction(
    idGestion: number,
    gestionAcademicaDto: GestionAcademicaDto
  ) {
    return from(updateAcademicManagmentUseCase(idGestion, gestionAcademicaDto));
  }
  //#endregion

  //#region Productos académicos
  addAcademicProductFunction(productosAcademicosDto: ProductosAcademicosDto) {
    return from(addAcademicProductsUseCase(productosAcademicosDto));
  }

  updateAcademicProductFunction(
    idProducto: number,
    productosAcademicosDto: ProductosAcademicosDto
  ) {
    return from(
      updateAcademicProductsUseCase(idProducto, productosAcademicosDto)
    );
  }
  //#endregion

  //#region Experiencia profesional
  addProfessionalExperienceFunction(
    experienciaProfesionalDto: ExperienciaProfesionalDto
  ) {
    return from(addProfessionalExperienceUseCase(experienciaProfesionalDto));
  }

  updateProfessionalExperienceFunction(
    idExperiencia: number,
    experienciaProfesionalDto: ExperienciaProfesionalDto
  ) {
    return from(
      updateProfessionalExperienceUseCase(
        idExperiencia,
        experienciaProfesionalDto
      )
    );
  }
  //#endregion
}
