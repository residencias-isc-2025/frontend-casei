import { environment } from '../../../environments/environment.development';

export const loginUseCase = async (username: string, password: string) => {
  try {
    const resp = await fetch(`${environment.api_url}/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if(resp.status !== 200 ) throw new Error(`ERROR ${resp.status}`);

    return resp.json;

  } catch (error) {
    console.log(error);
    return ('ERROR')
  }
};
