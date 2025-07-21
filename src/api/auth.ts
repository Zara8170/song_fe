// api/auth.ts
import { API_BASE_URL } from '@env';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const loginAnon = async (tempId: string): Promise<TokenPair> => {
  const res = await fetch(`${API_BASE_URL}/api/auth/anon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tempId }),
  });
  if (!res.ok) throw new Error('anon login failed');
  return res.json();
};

export const refreshTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<TokenPair> => {
  const res = await fetch(`${API_BASE_URL}/api/member/refresh`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Refresh-Token': refreshToken,
    },
  });
  if (!res.ok) throw new Error('refresh failed');
  return res.json();
};
