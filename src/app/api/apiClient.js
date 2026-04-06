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

async function parseResponsePayload(response) {
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
        return null;
    }

    return response.json().catch(() => null);
}

export async function apiRequest(path, options = {}) {
    const { body, headers, method = 'GET', requiresAuth = false, token } = options;

    const authToken = requiresAuth ? await resolveAuthToken(token) : token;
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: buildHeaders({ body, headers, token: authToken }),
        ...(body !== undefined ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
    });

    const payload = await parseResponsePayload(response);

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
