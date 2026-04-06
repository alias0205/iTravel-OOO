const FALLBACK_API_BASE_URL = 'https://ooo.nutrastat.com';

function normalizeBaseUrl(value) {
    return (value || FALLBACK_API_BASE_URL).trim().replace(/\/+$/, '');
}

export const API_BASE_URL = normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
