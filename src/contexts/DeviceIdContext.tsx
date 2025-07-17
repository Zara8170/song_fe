import { createContext, useContext } from 'react';

export const DeviceIdContext = createContext<string | null>(null);

export const useDeviceIdContext = () => useContext(DeviceIdContext);
