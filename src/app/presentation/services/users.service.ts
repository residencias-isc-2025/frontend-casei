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
  deleteAcademicManagmentUseCase,
  deleteAcademicProductsUseCase,
  deleteAcademicTrainingUseCase,
  deleteAwardsUseCase,
  deleteContributionUseCase,
  deleteDisciplinaryUpdateUseCase,
  deleteEngineeringDesignUseCase,
  deleteParticipationUseCase,
  deleteProfessionalAchievementsUseCase,
  deleteProfessionalExperienceUseCase,
  deleteTeachingTrainingUseCase,
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
  agregarFormacionAcademica(formacionAcademica: FormacionAcademicaDto) {
    return from(addAcademicTrainingUseCase(formacionAcademica));
  }

  actualizarFormacionAcademica(
    idFormacion: number,
    formacionAcademica: FormacionAcademicaDto
  ) {
    return from(updateAcademicTrainingUseCase(idFormacion, formacionAcademica));
  }

  borrarFormacionAcademica(idFormacion: number, accessToken: string) {
    return from(deleteAcademicTrainingUseCase(idFormacion, accessToken));
  }

  //#endregion

  //#region Capacitación docente
  agregarCapacitacionDocente(capacitacionDocente: CapacitacionDocenteDto) {
    return from(addTeachingTrainingUseCase(capacitacionDocente));
  }

  actualizarCapacitacionDocente(
    idCapacitacion: number,
    capacitacionDocente: CapacitacionDocenteDto
  ) {
    return from(
      updateTeachingTrainingUseCase(idCapacitacion, capacitacionDocente)
    );
  }

  borrarCapacitacionDocente(idCapacitacion: number, accessToken: string) {
    return from(deleteTeachingTrainingUseCase(idCapacitacion, accessToken));
  }
  //#endregion

  //#region Actualización disciplinar
  agregarActualizacionDisciplinar(
    actualizacionDisciplinar: ActualizacionDisciplinarDto
  ) {
    return from(addDisciplinaryUpdateUseCase(actualizacionDisciplinar));
  }

  actualizarActualizacionDisciplinar(
    idActualizacion: number,
    actualizacionDisciplinar: ActualizacionDisciplinarDto
  ) {
    return from(
      updateDisciplinaryUpdateUseCase(idActualizacion, actualizacionDisciplinar)
    );
  }

  borrarActualizacionDisciplinar(idActualizacion: number, accessToken: string) {
    return from(deleteDisciplinaryUpdateUseCase(idActualizacion, accessToken));
  }
  //#endregion

  //#region Gestión académica
  agregarGestionAcademica(gestionAcademicaDto: GestionAcademicaDto) {
    return from(addAcademicManagmentUseCase(gestionAcademicaDto));
  }

  actualizarGestionAcademica(
    idGestion: number,
    gestionAcademicaDto: GestionAcademicaDto
  ) {
    return from(updateAcademicManagmentUseCase(idGestion, gestionAcademicaDto));
  }

  borrarGestionAcademica(idGestion: number, accessToken: string) {
    return from(deleteAcademicManagmentUseCase(idGestion, accessToken));
  }
  //#endregion

  //#region Productos académicos
  agregarProductosAcademicos(productosAcademicosDto: ProductosAcademicosDto) {
    return from(addAcademicProductsUseCase(productosAcademicosDto));
  }

  actualizarProductosAcademicos(
    idProducto: number,
    productosAcademicosDto: ProductosAcademicosDto
  ) {
    return from(
      updateAcademicProductsUseCase(idProducto, productosAcademicosDto)
    );
  }

  borrarProductosAcademicos(idProducto: number, accessToken: string) {
    return from(deleteAcademicProductsUseCase(idProducto, accessToken));
  }
  //#endregion

  //#region Experiencia profesional
  agregarExperienciaProfesional(
    experienciaProfesionalDto: ExperienciaProfesionalDto
  ) {
    return from(addProfessionalExperienceUseCase(experienciaProfesionalDto));
  }

  actualizarExperienciaProfesional(
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

  borrarExperienciaProfesional(idExperiencia: number, accessToken: string) {
    return from(
      deleteProfessionalExperienceUseCase(idExperiencia, accessToken)
    );
  }
  //#endregion

  //#region Diseño ingenieril
  agregarDisenoIngenieril(disenoIngenierilDto: DisenoIngenierilDto) {
    return from(addEngineeringDesignUseCase(disenoIngenierilDto));
  }

  actualizarDisenoIngenieril(
    idDiseno: number,
    disenoIngenierilDto: DisenoIngenierilDto
  ) {
    return from(updateEngineeringDesignUseCase(idDiseno, disenoIngenierilDto));
  }

  borrarDisenoIngenieril(idDiseno: number, accessToken: string) {
    return from(deleteEngineeringDesignUseCase(idDiseno, accessToken));
  }
  //#endregion

  //#region Logros profesionales
  agregarLogroProfesional(logroProfesionalDto: LogrosPrefesionalesDto) {
    return from(addProfessionalAchievementsUseCase(logroProfesionalDto));
  }

  actualizarLogroProfesional(
    idLogro: number,
    logroProfesionalDto: LogrosPrefesionalesDto
  ) {
    return from(
      updateProfessionalAchievementsUseCase(idLogro, logroProfesionalDto)
    );
  }

  borrarLogroProfesional(idLogro: number, accessToken: string) {
    return from(deleteProfessionalAchievementsUseCase(idLogro, accessToken));
  }

  //#endregion

  //#region Participación
  agregarParticipacion(participacionDto: ParticipacionDto) {
    return from(addParticipationUseCase(participacionDto));
  }

  actualizarParticipacion(
    idParticipacion: number,
    participacionDto: ParticipacionDto
  ) {
    return from(updateParticipationUseCase(idParticipacion, participacionDto));
  }

  borrarParticipacion(idParticipacion: number, accessToken: string) {
    return from(deleteParticipationUseCase(idParticipacion, accessToken));
  }
  //#endregion

  //#region Premios
  agregarPremio(premioDto: PremiosDto) {
    return from(addAwardsUseCase(premioDto));
  }

  actualizarPremio(idPremio: number, premioDto: PremiosDto) {
    return from(updateAwardsUseCase(idPremio, premioDto));
  }

  borrarPremio(idPremio: number, accessToken: string) {
    return from(deleteAwardsUseCase(idPremio, accessToken));
  }
  //#endregion

  //#region Aportaciones
  agregarAportacion(aportacionDto: AportacionesDto) {
    return from(addContributionsUseCase(aportacionDto));
  }

  actualizarAportacion(idAportacion: number, aportacionDto: AportacionesDto) {
    return from(updateContributionUseCase(idAportacion, aportacionDto));
  }

  borrarAportacion(idAportacion: number, accessToken: string) {
    return from(deleteContributionUseCase(idAportacion, accessToken));
  }
  //#endregion
}
