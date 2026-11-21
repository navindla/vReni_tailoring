# React Native practicals

`src/` is now a self-contained learning feature. Open `features/learning/LearningHub.js` in the app, then use this guide alongside the practical files.

## 1–5: rendering architecture

1. **React Native architecture** — React runs application logic in JavaScript. It reconciles a React tree, and React Native renders platform-native `View`, `Text`, and control objects. Native modules connect device capabilities. See `features/learning/LearningHub.js` for the JS-to-native UI declaration.
2. **Old vs New Architecture** — The old asynchronous Bridge serializes batched JSON messages between JS and native. The New Architecture uses JSI C++ bindings: Fabric renders UI, and TurboModules load native APIs lazily. This reduces serialization and lets native code expose typed values more directly; it does not remove the need to keep JS fast.
3. **JSI, Fabric, TurboModules** — JSI is the runtime interface that lets C++/native bindings call JS objects. Fabric is the concurrent renderer that commits native UI. TurboModules replace eager native-module initialization with lazy, code-generated module interfaces. Use these through maintained libraries; write JSI only for performance-sensitive native integrations.
4. **Hermes** — Tap topics 4 or 5 to run `features/performance/ThreadHermesScreen.js`. It checks `global.HermesInternal` at runtime. Hermes is React Native's JavaScript engine: it compiles JavaScript to bytecode ahead of time, commonly improving startup and reducing memory use. Enable it in native build config, measure release builds, and inspect profiles instead of assuming a gain.
5. **JS vs UI thread** — The same lab deliberately blocks JavaScript for 800 ms while an `Animated` transform uses `useNativeDriver`. JS handles React logic, timers, and many event handlers. Android/iOS UI threads draw and process gestures. A long JS task delays state updates; blocking UI work drops frames. Move animation work to native/UI-driven systems and split expensive JS work with pagination or deferred tasks.

## 6–8: render performance

6. **FlatList optimization** — `CatalogList.js` uses virtualization, fixed row measurements, a stable key, batch/window controls, memoized rows, and pagination. Never render a huge collection with `ScrollView`.
7. **Why a component re-renders** — Its own state update, a parent render, a context value change, or a prop reference change triggers a render. A render is not automatically a native UI change; React compares output before committing.
8. **useMemo vs useCallback vs React.memo** — `useMemo` caches a computed value; `useCallback` caches a function reference; `React.memo` can skip a child render when props are shallow-equal. `LearningHub.js` shows all three. Measure first: unnecessary memoization also costs complexity and memory.

## 9–10: application state

9. **Redux architecture** — UI dispatches an action → reducer creates next state → selectors derive UI data → UI re-renders. Keep server cache, local UI state, and persisted data deliberately separated. Reducers are pure; effects live in thunks/listeners.
10. **Redux Toolkit** — Use `configureStore`, `createSlice`, and `createAsyncThunk` instead of handwritten action types and immutable-copy boilerplate.

```js
// Purpose: a slice groups one domain's state, reducers, and generated action creators.
import {configureStore, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
export const loadProfile = createAsyncThunk('profile/load', () => api('/me'));
const profileSlice = createSlice({name: 'profile', initialState: {data: null, status: 'idle'}, reducers: {signedOut: state => { state.data = null; }}, extraReducers: builder => builder.addCase(loadProfile.pending, state => { state.status = 'loading'; }).addCase(loadProfile.fulfilled, (state, action) => { state.data = action.payload; state.status = 'ready'; })});
export const store = configureStore({reducer: {profile: profileSlice.reducer}});
```

Install Redux Toolkit before using the sample: `yarn add @reduxjs/toolkit react-redux`.

## 11–14: data, auth, and real-time

11. **AsyncStorage vs secure storage** — `shared/storage/storage.js` caches non-secret JSON. Use iOS Keychain/Android Keystore through a secure-storage library for refresh tokens and credentials. Do not place access tokens, passwords, or encryption keys in AsyncStorage.
12. **API interceptor/token refresh** — `shared/network/apiClient.js` applies an auth header, funnels simultaneous 401s through one refresh promise, then retries once. Clear credentials and navigate to sign-in if refresh fails; avoid infinite retry loops.
13. **WebSocket implementation** — `shared/realtime/socket.js` reconnects with capped exponential backoff and returns `dispose`. In a component: `useEffect(() => socket.dispose, [socket])`. Authenticate using a short-lived handshake token, validate message schemas, and resync after reconnect.
14. **Offline-first** — Read from a local database/cache immediately, record writes in an outbox, then sync when connectivity returns. Every mutation needs an idempotency key and conflict policy (server-wins, client-wins, or merge). AsyncStorage is fine for small settings; use SQLite/Realm/WatermelonDB for queryable large data.

## 15–19: platform integration

15. **Deep linking** — Define a scheme/universal-link domain in Android/iOS and a navigation linking map. Validate every URL parameter as untrusted input.

```js
// Purpose: map an incoming URL to a predictable navigation route.
export const linking = {prefixes: ['musicapp://', 'https://app.example.com'], config: {screens: {Album: 'albums/:id'}}};
```

16. **Push notifications** — Request permission at a user-meaningful time, obtain the platform token, send it to your authenticated backend, and handle foreground/tap events. Notification payloads are untrusted: fetch protected data from the server after a tap rather than trusting payload content.
17. **Background tasks** — iOS and Android schedule opportunistically and may terminate work. Use platform-supported libraries (for example Background Fetch/WorkManager wrappers), make each task short and idempotent, persist a checkpoint, and never rely on exact timing.
18. **Native modules** — Build a tiny JS API around a well-defined native contract. Prefer maintained packages. For custom work, use TurboModule specs/codegen on New Architecture projects; resolve promises, validate inputs, and surface typed errors. See `platform/NativeModuleExample.md`.
19. **Android/iOS differences** — Android uses intents, Gradle, keystore signing and varied hardware; iOS uses URL schemes/universal links, Xcode, Keychain, provisioning and stricter background rules. Use `Platform.select` only at a narrow boundary; keep product logic shared.

## 20–24: reliability and scale

20. **Production crash debugging** — Capture version, build number, OS/device, breadcrumbs, non-sensitive user state, and source maps/dSYMs. Symbolicate the exact release artifact in a crash service (for example Sentry or Crashlytics), reproduce, fix, and verify via staged rollout. Never upload tokens or personal content as logs.
21. **Memory leaks** — Always return cleanup from `useEffect`: clear timers, unsubscribe listeners, abort fetches, dispose sockets, and release native media. Use `AbortController` for fetch and inspect retained objects with Hermes/Android Studio/Xcode profilers.

```js
// Purpose: cancel an obsolete request when a screen unmounts or its id changes.
useEffect(() => { const controller = new AbortController(); loadAlbum(id, controller.signal); return () => controller.abort(); }, [id]);
```

22. **App startup optimization** — Profile a release build from process launch. Keep initial route and critical state lean, defer analytics/noncritical SDKs after first interaction, lazy-load feature code where appropriate, avoid synchronous storage waterfalls, and optimize images/fonts. Do not delay first paint waiting for optional network work.
23. **Large-list optimization** — Tap topic 23 in the app to open `features/catalog/LargeListScreen.js`. It demonstrates cursor paging, `onEndReached` de-duplication, fixed row measurements, filtering of loaded data, stable callbacks, memoized rows, virtualized rendering, and a loading footer. Beyond this example: normalize data, precompute display fields, use thumbnails sized for the row, avoid nesting virtualized lists, and consider FlashList only after measuring FlatList limits.
24. **Large-data/offline architecture** — Store normalized records locally with indexes, cursors, tombstones, an outbox, and per-record sync metadata. Sync in chunks and transactions; a full JSON blob in AsyncStorage cannot support robust large-scale queries or conflict handling.

## 25–28: delivery and security

25. **CI/CD** — On pull requests run install-lockfile verification, lint, unit tests, type checks, and Android/iOS build smoke tests. On protected release tags, build signed artifacts in a secrets manager, upload source maps, distribute to internal testers, then promote progressively with rollback/kill-switch capability.
26. **Android build/release** — Set unique `versionCode` and user-facing `versionName`; build a signed release AAB with the upload keystore kept in CI secrets; test on devices; upload to Play Console internal track; validate pre-launch report; promote staged percentages. Never commit keystores or passwords.
27. **iOS build/release** — Increment `CFBundleVersion` and `CFBundleShortVersionString`; archive a Release build with correct signing/provisioning; upload with Xcode/Transporter; distribute using TestFlight; resolve App Store Connect checks; submit to review and release gradually where available. Keep certificates/profiles in secure CI storage.
28. **App security** — Use HTTPS with modern TLS, short-lived tokens plus secure storage, server-side authorization for every action, input validation, dependency/update scanning, obfuscated/minified release builds, secret-free client configuration, least-privilege permissions, and privacy-aware telemetry. Certificate pinning can raise the bar but needs a safe key-rotation plan; it never replaces server authorization.

## Suggested folder boundaries

```
src/
  features/<domain>/       # screens, feature UI, feature state
  shared/network/          # API/auth policy
  shared/storage/          # cache and persistence adapters
  shared/realtime/         # socket lifecycle
  platform/                # documented native boundaries
```
