import { useEffect, useState } from 'react';
import { BatteryInfo, Device, DeviceId, DeviceInfo } from '@capacitor/device';

export default function useDevice() {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const [deviceId, setDeviceId] = useState<DeviceId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setInfo(await Device.getInfo());
      setBattery(await Device.getBatteryInfo());
      setDeviceId(await Device.getId());
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => { refresh(); }, []);

  return { info, battery, deviceId, error, refresh };
}
