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
  // refreshToken은 서버에서 DB로 관리하므로 프론트에서는 제외
}

export const loginWithGoogle = async (
  idToken: string,
): Promise<LoginResponseDTO> => {
  try {
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
): Promise<{ accessToken: string }> => {
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

    return { accessToken: tokenData.accessToken };
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
