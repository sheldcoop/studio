import { getAuth } from 'firebase/auth';

export async function refreshAuthToken(): Promise<string | null> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) return null;
    
    // Force refresh the token
    const token = await user.getIdToken(true);
    return token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
}

export function setupTokenRefresh() {
  // Refresh token every 50 minutes (tokens expire after 60 minutes)
  const REFRESH_INTERVAL = 50 * 60 * 1000;
  
  setInterval(async () => {
    const token = await refreshAuthToken();
    if (token) {
      // Update session with new token
      await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      });
    }
  }, REFRESH_INTERVAL);
}
