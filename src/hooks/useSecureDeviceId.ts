import { useEffect, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import uuid from 'react-native-uuid';

import { loginAnon } from '../api/auth';
import { saveTokens } from '../utils/tokenStorage';

export const useSecureDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const savedId = await EncryptedStorage.getItem('device_id');
        const tempId = savedId ?? (uuid.v4() as string);

        if (!savedId) {
          await EncryptedStorage.setItem('device_id', tempId);
        }
        setDeviceId(tempId);

        const access = await EncryptedStorage.getItem('access_token');
        const refresh = await EncryptedStorage.getItem('refresh_token');

        if (!access || !refresh) {
          const { accessToken, refreshToken } = await loginAnon(tempId);
          await saveTokens(accessToken, refreshToken);
        }
      } catch (e) {
        console.error('SecureDeviceId error:', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  return { deviceId, loading };
};
