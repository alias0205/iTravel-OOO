import { API_BASE_URL } from '../config/env';
import { getAuthSession } from '../../features/auth/utils/authSession';

async function resolveAuthToken(explicitToken) {
    if (explicitToken) {
        return explicitToken;
    }

    const authSession = await getAuthSession();
    return authSession?.token || '';
}

function buildHeaders({ body, headers = {}, token }) {
    const nextHeaders = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...headers,
    };

    if (body !== undefined && !nextHeaders['Content-Type']) {
        nextHeaders['Content-Type'] = 'application/json';
    }

    if (token) {
        nextHeaders.Authorization = `Bearer ${token}`;
    }

    return nextHeaders;
}

function buildRequestUrl(path, method) {
    const normalizedPath = typeof path === 'string' ? path.trim() : '';

    if (/^https?:\/\//i.test(normalizedPath)) {
        return normalizedPath;
    }

    const separator = normalizedPath.startsWith('/') ? '' : '/';
    const url = `${API_BASE_URL}${separator}${normalizedPath}`;

    if (String(method || 'GET').toUpperCase() !== 'GET') {
        return url;
    }

    const cacheKey = `_ts=${Date.now()}`;
    return url.includes('?') ? `${url}&${cacheKey}` : `${url}?${cacheKey}`;
}

function tryParseJson(rawValue) {
    try {
        return {
            error: null,
            payload: JSON.parse(rawValue),
        };
    } catch (error) {
        return {
            error,
            payload: null,
        };
    }
}

async function parseResponsePayload(response) {
    if ([204, 205, 304].includes(response.status)) {
        return {
            contentType: (response.headers.get('content-type') || '').toLowerCase(),
            parseError: null,
            payload: null,
            rawBody: '',
        };
    }

    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    const rawBody = await response.text().catch(() => '');
    const trimmedBody = rawBody.trim();

    if (!trimmedBody) {
        return {
            contentType,
            parseError: null,
            payload: null,
            rawBody,
        };
    }

    const looksLikeJson =
        trimmedBody.startsWith('{') ||
        trimmedBody.startsWith('[') ||
        trimmedBody === 'null' ||
        trimmedBody === 'true' ||
        trimmedBody === 'false' ||
        /^-?\d+(?:\.\d+)?$/.test(trimmedBody);

    if (!contentType.includes('application/json') && !contentType.includes('+json') && !looksLikeJson) {
        return {
            contentType,
            parseError: null,
            payload: null,
            rawBody,
        };
    }

    const directParse = tryParseJson(trimmedBody);

    if (directParse.payload !== null) {
        return {
            contentType,
            parseError: null,
            payload: directParse.payload,
            rawBody,
        };
    }

    const normalizedBody = trimmedBody
        .replace(/^\uFEFF/, '')
        .replace(/\u0000/g, '')
        .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F]/g, '');
    const normalizedParse = tryParseJson(normalizedBody);

    if (normalizedParse.payload !== null) {
        return {
            contentType,
            parseError: directParse.error instanceof Error ? directParse.error.message : String(directParse.error || ''),
            payload: normalizedParse.payload,
            rawBody,
        };
    }

    return {
        contentType,
        parseError: directParse.error instanceof Error ? directParse.error.message : String(directParse.error || ''),
        payload: null,
        rawBody,
    };
}

export async function apiRequest(path, options = {}) {
    const { body, headers, method = 'GET', requiresAuth = false, token } = options;
    const upperMethod = String(method).toUpperCase();

    const authToken = requiresAuth ? await resolveAuthToken(token) : token;
    const requestHeaders = buildHeaders({
        body,
        headers:
            upperMethod === 'GET'
                ? {
                      'Cache-Control': 'no-cache, no-store, must-revalidate',
                      Pragma: 'no-cache',
                      ...headers,
                  }
                : headers,
        token: authToken,
    });
    const requestUrl = buildRequestUrl(path, upperMethod);
    const response = await fetch(requestUrl, {
        method: upperMethod,
        headers: requestHeaders,
        cache: 'no-store',
        ...(body !== undefined ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
    });

    const { contentType, parseError, payload, rawBody } = await parseResponsePayload(response);

    console.log('---------- api url ---------', requestUrl);
    console.log('---------- api options ---------', { method: upperMethod, headers: requestHeaders, body });
    console.log('---------- api response meta ---------', { ok: response.ok, status: response.status, contentType, parseError });
    if (payload == null) {
        console.log('---------- api raw body ---------', rawBody.slice(0, 500));
    }
    console.log('---------- apiRequest ---------', payload);

    return {
        ok: response.ok,
        payload,
        response,
        status: response.status,
    };
}

export async function apiRequestOrThrow(path, options = {}) {
    const result = await apiRequest(path, options);

    if (!result.ok) {
        const error = new Error(result.payload?.message || `Request failed with status ${result.status}.`);
        error.status = result.status;
        error.payload = result.payload;
        throw error;
    }

    return result.payload;
}

export function createApiUrl(path) {
    return `${API_BASE_URL}${path}`;
}
