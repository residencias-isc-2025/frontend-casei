import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import {
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
  agregarParticipacionUseCase,
  agregarLogroProfesionalUseCase,
  eliminarGestionAcademicaUseCase,
  eliminarProductoAcademicoUseCase,
  eliminarPremioUseCase,
  eliminarParticipacionUseCase,
  eliminarLogroProfesionalUseCse,
  actualizarGestionAcademicaUseCase,
  updateAcademicProductsUseCase,
  actualizarPremioUseCase,
  actualizarParticipacionUseCase,
  actualizarLogroProfesionalUseCase,
} from '@core/index';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
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
}
