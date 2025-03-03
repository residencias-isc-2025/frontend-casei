import { environment } from '@environments/environment';

import { ParticipacionResponse, ParticipacionDto } from '@interfaces/index';

export const updateParticipationUseCase = async (
  idParticipacion: number,
  participacionDto: ParticipacionDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/participacion/${idParticipacion}/`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${participacionDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organismo: participacionDto.organismo,
          periodo: participacionDto.periodo,
          nivel_p: participacionDto.nivel_p,
        }),
      }
    );

    const data = (await resp.json()) as ParticipacionResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al guardar datos.',
      };
    }

    return {
      ok: true,
      mensaje: 'Participación actualizada.',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
