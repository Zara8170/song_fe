import { API_BASE_URL } from '@env';
import { getAccessToken, clearTokens } from '../utils/tokenStorage';
import { refreshAccessToken } from './auth';

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('No access token found');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    try {
      const newToken = await refreshAccessToken(token);
      headers.set('Authorization', `Bearer ${newToken}`);

      return await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });
    } catch (error) {
      await clearTokens();
      throw error;
    }
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response;
};
