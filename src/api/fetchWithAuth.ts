import { API_BASE_URL } from '@env';
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from '../utils/tokenStorage';
import { refreshTokens } from './auth';

export const fetchWithAuth = async (
  input: string,
  init: RequestInit = {},
): Promise<Response> => {
  let access = await getAccessToken();
  const refresh = await getRefreshToken();

  const authInit: RequestInit = {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...(access ? { Authorization: `Bearer ${access}` } : {}),
    },
  };

  let res = await fetch(`${API_BASE_URL}${input}`, authInit);

  if (res.status === 401 && refresh) {
    try {
      const pair = await refreshTokens(access ?? '', refresh);
      await saveTokens(pair.accessToken, pair.refreshToken);
      access = pair.accessToken;

      authInit.headers = {
        ...(init.headers || {}),
        Authorization: `Bearer ${access}`,
      };
      res = await fetch(`${API_BASE_URL}${input}`, authInit);
    } catch (e) {
      await clearTokens();
      throw e;
    }
  }

  return res;
};
