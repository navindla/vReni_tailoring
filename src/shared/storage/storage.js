import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_CACHE = '@learning/session-cache';

// Purpose: AsyncStorage holds non-sensitive, serializable cache/preferences only.
export async function saveCachedSession(session) {
  await AsyncStorage.setItem(SESSION_CACHE, JSON.stringify({...session, cachedAt: Date.now()}));
}

export async function getCachedSession() {
  const raw = await AsyncStorage.getItem(SESSION_CACHE);
  return raw ? JSON.parse(raw) : null;
}

// Purpose: access tokens belong in Keychain (iOS) / Keystore (Android), never AsyncStorage.
// Example with react-native-keychain (install it before use):
// await Keychain.setGenericPassword('session', accessToken, {service: 'com.example.session'});
