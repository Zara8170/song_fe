import EncryptedStorage from 'react-native-encrypted-storage';

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export const saveTokens = async (access: string, refresh: string) => {
  await EncryptedStorage.setItem(ACCESS_KEY, access);
  await EncryptedStorage.setItem(REFRESH_KEY, refresh);
};

export const getAccessToken = () => EncryptedStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => EncryptedStorage.getItem(REFRESH_KEY);

export const clearTokens = async () => {
  await EncryptedStorage.removeItem(ACCESS_KEY);
  await EncryptedStorage.removeItem(REFRESH_KEY);
};
