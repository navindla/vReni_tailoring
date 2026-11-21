# Custom native module contract

Use a custom module only when React Native or a maintained package cannot expose the capability.

```ts
// Purpose: TypeScript spec gives TurboModule codegen a stable JS/native contract.
import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';
export interface Spec extends TurboModule {
  getDeviceName(): Promise<string>;
}
export default TurboModuleRegistry.getEnforcing<Spec>('DeviceInfoModule');
```

Android implementation belongs under `android/app/src/main/java/...`; iOS implementation belongs under `ios/...`. Both must validate input, resolve/reject promises exactly once, avoid blocking the UI thread, and keep platform-specific behavior documented. Follow the React Native version-matched TurboModule/codegen documentation when wiring the generated artifacts.
