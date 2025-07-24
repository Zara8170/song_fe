// api/auth.ts
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { saveTokens, getAccessToken, clearTokens } from '../utils/tokenStorage';
import { API_BASE_URL } from '@env';

export interface LoginResponseDTO {
  accessToken: string;
  // ... 기타 사용자 정보
}

export const loginWithGoogle = async (): Promise<LoginResponseDTO | null> => {
  try {
    await GoogleSignin.hasPlayServices();
    const signInResult: any = await GoogleSignin.signIn();

    console.log(
      'Full response from GoogleSignin.signIn():',
      JSON.stringify(signInResult, null, 2),
    );

    // signIn()이 반환하는 객체의 data 속성에서 idToken을 추출합니다.
    const idToken = signInResult?.data?.idToken;

    if (!idToken) {
      console.error(
        'Could not find idToken in the response from GoogleSignin.signIn():',
        JSON.stringify(signInResult, null, 2),
      );
      throw new Error(
        'Failed to extract idToken from Google Sign-In response.',
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Google login failed');
    }

    const loginResponse: LoginResponseDTO = await response.json();
    await saveTokens(loginResponse.accessToken, '');

    return loginResponse;
  } catch (error) {
    console.error('Login with Google error:', error);
    return null;
  }
};

export const refreshAccessToken = async (
  expiredToken: string,
): Promise<{ accessToken: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/member/refresh`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${expiredToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to refresh access token');
  }

  return response.json();
};

export const logout = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    await clearTokens();
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  return await getAccessToken();
};
