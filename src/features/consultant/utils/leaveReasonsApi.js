import { apiRequest } from '../../../app/api/apiClient';

const LEAVE_REASONS_ENDPOINT = '/api/out-of-office/reasons';

function getReasonsCollection(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    if (Array.isArray(payload?.reasons)) {
        return payload.reasons;
    }

    if (Array.isArray(payload?.results)) {
        return payload.results;
    }

    return [];
}

function normalizeLeaveReason(reason, showCodePrefix) {
    if (typeof reason === 'string') {
        return {
            id: reason,
            label: reason,
            raw: reason,
            value: reason,
        };
    }

    const code = reason?.code || reason?.reason_code || reason?.prefix || '';
    const reasonName = reason?.reason_name || reason?.name || reason?.reason || reason?.title || reason?.label || '';
    const fullLabel = reason?.full_label || reason?.display_label || (code && reasonName ? `${code} - ${reasonName}` : reasonName);
    const label = showCodePrefix ? fullLabel || reasonName : reasonName || fullLabel;
    const value = reason?.id || reason?.uuid || reason?.slug || code || reasonName || fullLabel;

    return {
        id: String(value),
        label: label || 'Unknown reason',
        raw: reason,
        value: String(value),
    };
}

export async function fetchLeaveReasons({ token, showCodePrefix = false }) {
    const { ok, payload, status } = await apiRequest(LEAVE_REASONS_ENDPOINT, {
        method: 'GET',
        requiresAuth: true,
        token,
    });

    if (status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
    }

    if (!ok) {
        throw new Error(payload?.message || 'Unable to load leave types right now.');
    }

    return getReasonsCollection(payload).map((reason) => normalizeLeaveReason(reason, showCodePrefix));
}
