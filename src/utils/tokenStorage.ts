import EncryptedStorage from 'react-native-encrypted-storage';

const ACCESS_KEY = 'access_token';
const MEMBER_ID_KEY = 'member_id';

// accessToken만 저장 (refreshToken은 서버 DB에서 관리)
export const saveTokens = async (access: string) => {
  await EncryptedStorage.setItem(ACCESS_KEY, access);
};

export const getAccessToken = () => EncryptedStorage.getItem(ACCESS_KEY);

export const saveMemberId = async (memberId: number) => {
  await EncryptedStorage.setItem(MEMBER_ID_KEY, memberId.toString());
};

export const getMemberId = async (): Promise<number | null> => {
  const memberIdStr = await EncryptedStorage.getItem(MEMBER_ID_KEY);
  return memberIdStr ? parseInt(memberIdStr, 10) : null;
};

export const clearTokens = async () => {
  await EncryptedStorage.removeItem(ACCESS_KEY);
  await EncryptedStorage.removeItem(MEMBER_ID_KEY);
};
