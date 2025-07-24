import { getAuthToken, refreshAccessToken, logout } from './auth';
import { API_BASE_URL } from '@env';
import { saveTokens } from '../utils/tokenStorage';

let isRefreshing = false;

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

  if (response.status === 401 && token) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const { accessToken: newAccessToken } = await refreshAccessToken(token);
        await saveTokens(newAccessToken, ''); // 현재 리프레시 토큰은 관리하지 않으므로 빈 문자열 전달

        headers.set('Authorization', `Bearer ${newAccessToken}`);

        // 원래 요청을 새 토큰으로 재시도
        response = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers,
        });
      } catch (error) {
        console.error('Failed to refresh token, logging out.', error);
        await logout(); // 토큰 삭제 및 구글 로그아웃
        // 에러를 던져서 사용하는 쪽에서 로그인 화면으로 보내도록 처리
        throw new Error('Session expired. Please log in again.');
      } finally {
        isRefreshing = false;
      }
    }
  }

  return response;
};

export default fetchWithAuth;
