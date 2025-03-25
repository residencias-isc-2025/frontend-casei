import { Injectable } from '@angular/core';
import {
  obtenerListaGestionAcademicaUseCase,
  obtenerListaProductoAcademicoUseCase,
  obtenerListaPremioUseCase,
  obtenerListaAportacionUseCase,
  obtenerListaActualizacionDisplinarUseCase,
  obtenerListaDisenoIngenierilUseCase,
  obtenerListaParticipacionUseCase,
  obtenerListaLogroProfesionalUseCase,
  obtenerListaExperienciaProfesionalUseCase,
  obtenerListaCapacitacionDocenteUseCase,
} from '@core/index';

import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  loadCapacitacionDocenteFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(
      obtenerListaCapacitacionDocenteUseCase(accessToken, page, pageSize)
    );
  }

  loadActualizacionDisciplinarFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(
      obtenerListaActualizacionDisplinarUseCase(accessToken, page, pageSize)
    );
  }

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

  loadDisenoIngenierilFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(
      obtenerListaDisenoIngenierilUseCase(accessToken, page, pageSize)
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

  loadAportacionesFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(obtenerListaAportacionUseCase(accessToken, page, pageSize));
  }
}
