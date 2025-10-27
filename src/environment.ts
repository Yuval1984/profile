// src/environments/environment.ts
export const environment = {
    production: false,
    // Use proxy in development to avoid CORS
    API_BASE: 'https://metrics-server-yjqf.onrender.com/v1',
    PROFILE_APP: 'profile',
    PROFILE_API_KEY: 'pKey789', // ← your profile key from API_KEYS
    HEARTBEAT_MS: 15000
};
