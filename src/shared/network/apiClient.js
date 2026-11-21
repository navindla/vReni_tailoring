// Purpose: a small fetch client centralizes auth, errors, and a single token refresh.
let accessToken = null;
let refreshPromise = null;
export const setAccessToken = token => { accessToken = token; };

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch('https://api.example.com/auth/refresh', {method: 'POST', credentials: 'include'})
      .then(r => { if (!r.ok) { throw new Error('Session expired'); } return r.json(); })
      .then(({accessToken: token}) => { setAccessToken(token); return token; })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise; // Concurrent 401s await the same refresh, not a refresh storm.
}

export async function api(path, options = {}, retried = false) {
  const response = await fetch(`https://api.example.com${path}`, {...options, headers: {'Content-Type': 'application/json', ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}), ...options.headers}});
  if (response.status === 401 && !retried) { await refreshAccessToken(); return api(path, options, true); }
  if (!response.ok) { throw new Error(`Request failed: ${response.status}`); }
  return response.status === 204 ? null : response.json();
}
