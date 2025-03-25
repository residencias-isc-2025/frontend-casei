import { Injectable } from '@angular/core';
import {
  obtenerListaGestionAcademicaUseCase,
  obtenerListaProductoAcademicoUseCase,
  obtenerListaPremioUseCase,
  obtenerListaParticipacionUseCase,
  obtenerListaLogroProfesionalUseCase,
  obtenerListaExperienciaProfesionalUseCase,
} from '@core/index';

import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  loadGestionAcademicaFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(
      obtenerListaGestionAcademicaUseCase(accessToken, page, pageSize)
    );
  }

  loadProductosAcademicosFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(
      obtenerListaProductoAcademicoUseCase(accessToken, page, pageSize)
    );
  }

  loadExperienciaProfesionalFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(
      obtenerListaExperienciaProfesionalUseCase(accessToken, page, pageSize)
    );
  }

  loadLogrosProfesionalesFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(
      obtenerListaLogroProfesionalUseCase(accessToken, page, pageSize)
    );
  }

  loadParticipacionesFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(obtenerListaParticipacionUseCase(accessToken, page, pageSize));
  }

  loadPremiosFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(obtenerListaPremioUseCase(accessToken, page, pageSize));
  }
}
