import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import {
  ActualizacionDisciplinarDto,
  AportacionesDto,
  CapacitacionDocenteDto,
  CreateUserDto,
  DisenoIngenierilDto,
  ExperienciaProfesionalDto,
  FormacionAcademicaDto,
  GestionAcademicaDto,
  LogrosPrefesionalesDto,
  ParticipacionDto,
  PremiosDto,
  ProductosAcademicosDto,
  UpdateUserDto,
} from '@interfaces/index';

import {
  addAcademicManagmentUseCase,
  addAcademicProductsUseCase,
  addAcademicTrainingUseCase,
  addAwardsUseCase,
  addContributionsUseCase,
  addDisciplinaryUpdateUseCase,
  addEngineeringDesignUseCase,
  addParticipationUseCase,
  addProfessionalAchievementsUseCase,
  addProfessionalExperienceUseCase,
  addTeachingTrainingUseCase,
  changePasswordUseCase,
  createUsersByCsvUseCase,
  createUserUseCase,
  disableUserUseCase,
  enableUserUseCase,
  getAllUsersUseCase,
  getUserUseCase,
  resetPasswordUseCase,
  updateAcademicManagmentUseCase,
  updateAcademicProductsUseCase,
  updateAcademicTrainingUseCase,
  updateAwardsUseCase,
  updateContributionUseCase,
  updateDisciplinaryUpdateUseCase,
  updateEngineeringDesignUseCase,
  updateParticipationUseCase,
  updateProfessionalAchievementsUseCase,
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

  getAllUsers(accessToken: string, page: number) {
    return from(getAllUsersUseCase(accessToken, page));
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

  resetPassword(accessToken: string, userId: number) {
    return from(resetPasswordUseCase(accessToken, userId));
  }

  createUsersByCsv(accessToken: string, formData: FormData) {
    return from(createUsersByCsvUseCase(accessToken, formData));
  }

  enableUserFunction(userId: number, accessToken: string) {
    return from(enableUserUseCase(userId, accessToken));
  }

  disableUserFunction(userId: number, accessToken: string) {
    return from(disableUserUseCase(userId, accessToken));
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

  //#region Diseño ingenieril
  addEngineeringDesignFunction(disenoIngenierilDto: DisenoIngenierilDto) {
    return from(addEngineeringDesignUseCase(disenoIngenierilDto));
  }

  updateEngineeringDesignFunction(
    idDiseno: number,
    disenoIngenierilDto: DisenoIngenierilDto
  ) {
    return from(updateEngineeringDesignUseCase(idDiseno, disenoIngenierilDto));
  }
  //#endregion

  //#region Logros profesionales
  addProfessionalAchievementsFunction(
    logroProfesionalDto: LogrosPrefesionalesDto
  ) {
    return from(addProfessionalAchievementsUseCase(logroProfesionalDto));
  }

  updateProfessionalAchievementsFunction(
    idLogro: number,
    logroProfesionalDto: LogrosPrefesionalesDto
  ) {
    return from(
      updateProfessionalAchievementsUseCase(idLogro, logroProfesionalDto)
    );
  }
  //#endregion

  //#region Participación
  addParticipationFunction(participacionDto: ParticipacionDto) {
    return from(addParticipationUseCase(participacionDto));
  }

  updateParticipationFunction(
    idParticipacion: number,
    participacionDto: ParticipacionDto
  ) {
    return from(updateParticipationUseCase(idParticipacion, participacionDto));
  }
  //#endregion

  //#region Premios
  addPremioFunction(premioDto: PremiosDto) {
    return from(addAwardsUseCase(premioDto));
  }

  updatePremioFunction(idPremio: number, premioDto: PremiosDto) {
    return from(updateAwardsUseCase(idPremio, premioDto));
  }
  //#endregion

  //#region Aportaciones
  addAportacionesFunction(aportacionDto: AportacionesDto) {
    return from(addContributionsUseCase(aportacionDto));
  }

  updateAportacionesFunction(
    idAportacion: number,
    aportacionDto: AportacionesDto
  ) {
    return from(updateContributionUseCase(idAportacion, aportacionDto));
  }
  //#endregion
}
