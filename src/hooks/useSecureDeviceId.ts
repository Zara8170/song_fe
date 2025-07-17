import { useEffect, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import uuid from 'react-native-uuid';

export const useSecureDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrCreateDeviceId = async () => {
      try {
        const savedId = await EncryptedStorage.getItem('device_id');
        if (savedId) {
          setDeviceId(savedId);
        } else {
          const newId = uuid.v4() as string;
          await EncryptedStorage.setItem('device_id', newId);
          setDeviceId(newId);
        }
      } catch (e) {
        console.error('EncryptedStorage error:', e);
      } finally {
        setLoading(false);
      }
    };

    getOrCreateDeviceId();
  }, []);

  return { deviceId, loading };
};
