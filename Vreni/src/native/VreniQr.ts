

import { NativeModules } from 'react-native';

interface VreniQrNativeModule {
  generateQr(value: string, size: number): Promise<string>;
}

const VreniQr: VreniQrNativeModule = NativeModules.VreniQr;

export default VreniQr;
