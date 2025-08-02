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

      const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });

      if (!retryResponse.ok) {
        // 에러 응답의 본문을 미리 읽어서 에러 객체에 포함
        const errorResponse = retryResponse.clone();
        let errorData;
        try {
          errorData = await errorResponse.json();
        } catch (jsonError) {
          try {
            errorData = await errorResponse.text();
          } catch (textError) {
            errorData = null;
          }
        }

        const error = new Error(`API request failed: ${retryResponse.status}`);
        (error as any).response = retryResponse.clone();
        (error as any).responseData = errorData;
        throw error;
      }

      return retryResponse;
    } catch (error) {
      await clearTokens();
      throw error;
    }
  }

  if (!response.ok) {
    // 에러 응답의 본문을 미리 읽어서 에러 객체에 포함
    const errorResponse = response.clone();
    let errorData;
    try {
      errorData = await errorResponse.json();
    } catch (jsonError) {
      try {
        errorData = await errorResponse.text();
      } catch (textError) {
        errorData = null;
      }
    }

    const error = new Error(`API request failed: ${response.status}`);
    (error as any).response = response.clone();
    (error as any).responseData = errorData;
    throw error;
  }

  return response;
};
