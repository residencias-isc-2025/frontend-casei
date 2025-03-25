import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import {
  ActualizacionDisciplinarDto,
  AportacionDto,
  DisenoIngenierilDto,
  ExperienciaProfesionalDto,
  GestionAcademicaDto,
  LogroPrefesionalDto,
  ParticipacionDto,
  PremiosDto,
  ProductoAcademicoDto,
} from '@interfaces/index';

import {
  agregarGestionAcademicaUseCase,
  agregarProductoAcademicoUseCase,
  agregarPremioUseCase,
  agregarAportacionUseCase,
  agregarActualizacionDiscplinarUseCase,
  agregarDisenoIngenierilUseCase,
  agregarParticipacionUseCase,
  agregarLogroProfesionalUseCase,
  agregarExperienciaProfesionalUseCase,
  eliminarGestionAcademicaUseCase,
  eliminarProductoAcademicoUseCase,
  eliminarPremioUseCase,
  eliminarAportacionUseCase,
  eliminarActualizacionDisciplinarUseCase,
  eliminarDisenoIngenierilUseCase,
  eliminarParticipacionUseCase,
  eliminarLogroProfesionalUseCse,
  eliminarExperienciaProfesionalUseCase,
  actualizarGestionAcademicaUseCase,
  updateAcademicProductsUseCase,
  actualizarPremioUseCase,
  actualizarAportacionUseCase,
  actualizarActualizacionDisciplinarUseCase,
  actualizarDisenoIngenierilUseCase,
  actualizarParticipacionUseCase,
  actualizarLogroProfesionalUseCase,
  actualizarExperienciaProfesionalUseCase,
} from '@core/index';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  //#region Actualización disciplinar
  agregarActualizacionDisciplinar(
    actualizacionDisciplinar: ActualizacionDisciplinarDto
  ) {
    return from(
      agregarActualizacionDiscplinarUseCase(actualizacionDisciplinar)
    );
  }

  actualizarActualizacionDisciplinar(
    idActualizacion: number,
    actualizacionDisciplinar: ActualizacionDisciplinarDto
  ) {
    return from(
      actualizarActualizacionDisciplinarUseCase(
        idActualizacion,
        actualizacionDisciplinar
      )
    );
  }

  borrarActualizacionDisciplinar(idActualizacion: number, accessToken: string) {
    return from(
      eliminarActualizacionDisciplinarUseCase(idActualizacion, accessToken)
    );
  }
  //#endregion

  //#region Gestión académica
  agregarGestionAcademica(gestionAcademicaDto: GestionAcademicaDto) {
    return from(agregarGestionAcademicaUseCase(gestionAcademicaDto));
  }

  actualizarGestionAcademica(
    idGestion: number,
    gestionAcademicaDto: GestionAcademicaDto
  ) {
    return from(
      actualizarGestionAcademicaUseCase(idGestion, gestionAcademicaDto)
    );
  }

  borrarGestionAcademica(idGestion: number, accessToken: string) {
    return from(eliminarGestionAcademicaUseCase(idGestion, accessToken));
  }
  //#endregion

  //#region Productos académicos
  agregarProductosAcademicos(productosAcademicosDto: ProductoAcademicoDto) {
    return from(agregarProductoAcademicoUseCase(productosAcademicosDto));
  }

  actualizarProductosAcademicos(
    idProducto: number,
    productosAcademicosDto: ProductoAcademicoDto
  ) {
    return from(
      updateAcademicProductsUseCase(idProducto, productosAcademicosDto)
    );
  }

  borrarProductosAcademicos(idProducto: number, accessToken: string) {
    return from(eliminarProductoAcademicoUseCase(idProducto, accessToken));
  }
  //#endregion

  //#region Experiencia profesional
  agregarExperienciaProfesional(
    experienciaProfesionalDto: ExperienciaProfesionalDto
  ) {
    return from(
      agregarExperienciaProfesionalUseCase(experienciaProfesionalDto)
    );
  }

  actualizarExperienciaProfesional(
    idExperiencia: number,
    experienciaProfesionalDto: ExperienciaProfesionalDto
  ) {
    return from(
      actualizarExperienciaProfesionalUseCase(
        idExperiencia,
        experienciaProfesionalDto
      )
    );
  }

  borrarExperienciaProfesional(idExperiencia: number, accessToken: string) {
    return from(
      eliminarExperienciaProfesionalUseCase(idExperiencia, accessToken)
    );
  }
  //#endregion

  //#region Diseño ingenieril
  agregarDisenoIngenieril(disenoIngenierilDto: DisenoIngenierilDto) {
    return from(agregarDisenoIngenierilUseCase(disenoIngenierilDto));
  }

  actualizarDisenoIngenieril(
    idDiseno: number,
    disenoIngenierilDto: DisenoIngenierilDto
  ) {
    return from(
      actualizarDisenoIngenierilUseCase(idDiseno, disenoIngenierilDto)
    );
  }

  borrarDisenoIngenieril(idDiseno: number, accessToken: string) {
    return from(eliminarDisenoIngenierilUseCase(idDiseno, accessToken));
  }
  //#endregion

  //#region Logros profesionales
  agregarLogroProfesional(logroProfesionalDto: LogroPrefesionalDto) {
    return from(agregarLogroProfesionalUseCase(logroProfesionalDto));
  }

  actualizarLogroProfesional(
    idLogro: number,
    logroProfesionalDto: LogroPrefesionalDto
  ) {
    return from(
      actualizarLogroProfesionalUseCase(idLogro, logroProfesionalDto)
    );
  }

  borrarLogroProfesional(idLogro: number, accessToken: string) {
    return from(eliminarLogroProfesionalUseCse(idLogro, accessToken));
  }

  //#endregion

  //#region Participación
  agregarParticipacion(participacionDto: ParticipacionDto) {
    return from(agregarParticipacionUseCase(participacionDto));
  }

  actualizarParticipacion(
    idParticipacion: number,
    participacionDto: ParticipacionDto
  ) {
    return from(
      actualizarParticipacionUseCase(idParticipacion, participacionDto)
    );
  }

  borrarParticipacion(idParticipacion: number, accessToken: string) {
    return from(eliminarParticipacionUseCase(idParticipacion, accessToken));
  }
  //#endregion

  //#region Premios
  agregarPremio(premioDto: PremiosDto) {
    return from(agregarPremioUseCase(premioDto));
  }

  actualizarPremio(idPremio: number, premioDto: PremiosDto) {
    return from(actualizarPremioUseCase(idPremio, premioDto));
  }

  borrarPremio(idPremio: number, accessToken: string) {
    return from(eliminarPremioUseCase(idPremio, accessToken));
  }
  //#endregion

  //#region Aportaciones
  agregarAportacion(aportacionDto: AportacionDto) {
    return from(agregarAportacionUseCase(aportacionDto));
  }

  actualizarAportacion(idAportacion: number, aportacionDto: AportacionDto) {
    return from(actualizarAportacionUseCase(idAportacion, aportacionDto));
  }

  borrarAportacion(idAportacion: number, accessToken: string) {
    return from(eliminarAportacionUseCase(idAportacion, accessToken));
  }
  //#endregion
}
