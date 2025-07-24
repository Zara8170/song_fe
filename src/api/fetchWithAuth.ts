import { getAuthToken, logout, refreshAccessToken } from './auth';
import { API_BASE_URL } from '@env';
import { saveTokens } from '../utils/tokenStorage';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  let token = await getAuthToken();

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(async newToken => {
          headers.set('Authorization', `Bearer ${newToken}`);
          return await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers,
          });
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    isRefreshing = true;

    return new Promise(async (resolve, reject) => {
      try {
        if (!token) {
          throw new Error('No token available for refresh');
        }
        const { accessToken: newAccessToken } = await refreshAccessToken(token);
        await saveTokens(newAccessToken);
        headers.set('Authorization', `Bearer ${newAccessToken}`);
        processQueue(null, newAccessToken);
        const newResponse = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers,
        });
        resolve(newResponse);
      } catch (error) {
        processQueue(error, null);
        console.error('Failed to refresh token, logging out.', error);
        await logout();
        reject(new Error('Session expired. Please log in again.'));
      } finally {
        isRefreshing = false;
      }
    });
  }

  if (!response.ok) {
    try {
      const errorBody = await response.json();
      console.error('API Error:', errorBody);
      throw new Error(errorBody.message || 'An unknown error occurred');
    } catch (e: any) {
      throw new Error(
        `API request failed with status ${response.status}: ${e.message}`,
      );
    }
  }

  return response;
};

export default fetchWithAuth;
