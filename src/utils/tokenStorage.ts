import EncryptedStorage from 'react-native-encrypted-storage';

const ACCESS_KEY = 'access_token';

export const saveTokens = async (access: string) => {
  await EncryptedStorage.setItem(ACCESS_KEY, access);
};

export const getAccessToken = () => EncryptedStorage.getItem(ACCESS_KEY);

export const clearTokens = async () => {
  await EncryptedStorage.removeItem(ACCESS_KEY);
};
