// api/auth.ts
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  saveTokens,
  getAccessToken,
  clearTokens,
  saveMemberId,
  getMemberId,
} from '../utils/tokenStorage';
import { API_BASE_URL } from '@env';

export interface LoginResponseDTO {
  memberId: number;
  email: string;
  nickname: string;
  accessToken: string;
}

console.log('API_BASE_URL:', API_BASE_URL);

export const loginWithGoogle = async (
  idToken: string,
): Promise<LoginResponseDTO> => {
  try {
    console.log('로그인 요청 주소:', `${API_BASE_URL}/api/auth/google`);
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const loginResponse = await response.json();
    await saveTokens(loginResponse.accessToken);
    await saveMemberId(loginResponse.memberId);

    return loginResponse;
  } catch (error) {
    throw error;
  }
};

export const refreshAccessToken = async (
  expiredToken: string,
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/member/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${expiredToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const tokenData = await response.json();
    await saveTokens(tokenData.accessToken);

    return tokenData.accessToken;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    await clearTokens();
  } catch (error) {
    throw error;
  }
};
export const getAuthToken = async (): Promise<string | null> => {
  return await getAccessToken();
};

export const getCurrentMemberId = async (): Promise<number | null> => {
  return await getMemberId();
};

export const deleteMember = async () => {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('토큰이 없습니다.');
    }

    const response = await fetch(`${API_BASE_URL}/api/member`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('회원 탈퇴 실패');
    }

    return await response.text();
  } catch (error) {
    console.error('회원 탈퇴 에러:', error);
    throw error;
  }
};
