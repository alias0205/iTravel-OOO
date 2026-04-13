import { apiRequest } from '../../../app/api/apiClient';
import { approvalAvatarSources } from '../data/approvalAvatarSources';

const OUT_OF_OFFICE_ENDPOINT = '/api/out-of-office';
const OUT_OF_OFFICE_APPROVALS_ENDPOINT = '/api/out-of-office/approvals';
const STATUS_MAP = {
    draft: 'draft',
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected',
    0: 'draft',
    1: 'pending',
    2: 'rejected',
    3: 'approved',
};

function getRecordsCollection(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    if (Array.isArray(payload?.records)) {
        return payload.records;
    }

    return [];
}

function getPaginationMeta(payload) {
    return (
        payload?.meta ||
        payload?.pagination || {
            current_page: payload?.current_page || 1,
            last_page: payload?.last_page || 1,
            per_page: payload?.per_page || 15,
            total: payload?.total || getRecordsCollection(payload).length,
        }
    );
}

function formatDisplayDate(dateValue, options = {}) {
    if (!dateValue) {
        return options.fallback || 'N/A';
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
        return options.fallback || 'N/A';
    }

    return parsedDate.toLocaleDateString('en-US', {
        month: options.month || 'short',
        day: '2-digit',
        year: options.includeYear === false ? undefined : 'numeric',
    });
}

function formatDateRange(startDate, endDate) {
    if (!startDate || !endDate) {
        return 'Date unavailable';
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return 'Date unavailable';
    }

    const sameYear = start.getFullYear() === end.getFullYear();
    const sameMonth = sameYear && start.getMonth() === end.getMonth();

    if (sameMonth) {
        const month = start.toLocaleDateString('en-US', { month: 'short' });
        return `${month} ${String(start.getDate()).padStart(2, '0')} - ${String(end.getDate()).padStart(2, '0')}, ${end.getFullYear()}`;
    }

    if (sameYear) {
        return `${formatDisplayDate(startDate, { includeYear: false })} - ${formatDisplayDate(endDate)}, ${end.getFullYear()}`.replace(', ', ' ');
    }

    return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
}

function getDurationLabel(startDate, endDate) {
    if (!startDate || !endDate) {
        return 'N/A';
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return 'N/A';
    }

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const days =
        Math.floor((new Date(end.getFullYear(), end.getMonth(), end.getDate()) - new Date(start.getFullYear(), start.getMonth(), start.getDate())) / millisecondsPerDay) + 1;

    if (days <= 0) {
        return 'N/A';
    }

    return `${days} ${days === 1 ? 'day' : 'days'}`;
}

function getStatusTone(statusValue) {
    if (statusValue && typeof statusValue === 'object') {
        const nestedValue = statusValue.value ?? statusValue.id ?? statusValue.code;
        const nestedLabel = typeof statusValue.label === 'string' ? statusValue.label.toLowerCase() : '';

        return STATUS_MAP[nestedValue] || STATUS_MAP[nestedLabel] || 'pending';
    }

    const normalizedStatus = STATUS_MAP[String(statusValue).toLowerCase?.() || statusValue] || STATUS_MAP[statusValue] || 'pending';
    return normalizedStatus;
}

function getStatusLabel(statusValue, statusTone) {
    if (statusValue && typeof statusValue === 'object' && typeof statusValue.label === 'string' && statusValue.label.trim()) {
        return statusValue.label.trim();
    }

    return statusTone.charAt(0).toUpperCase() + statusTone.slice(1);
}

function getLeaveToneKey(reason) {
    const source = `${reason?.code || ''} ${reason?.reason_name || reason?.name || reason?.label || ''}`.toLowerCase();

    if (source.includes('sick')) {
        return 'sick';
    }

    if (source.includes('business')) {
        return 'business';
    }

    if (source.includes('remote')) {
        return 'remote';
    }

    return 'annual';
}

function getPerson(record) {
    return record?.user || record?.employee || record?.requester || record?.consultant || {};
}

function buildAvatarLabel(fullName) {
    const parts = fullName.split(' ').filter(Boolean);
    return `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase() || 'OO';
}

function buildActionError(payload, fallbackMessage, status) {
    const message =
        (typeof payload?.message === 'string' && payload.message.trim()) ||
        Object.values(payload?.errors || {}).find((fieldErrors) => Array.isArray(fieldErrors) && fieldErrors.length > 0)?.[0] ||
        fallbackMessage;

    const error = new Error(message);
    error.status = status;
    error.payload = payload;
    return error;
}

function resolveServerNow(payload, response) {
    const payloadServerTime =
        payload?.server_time || payload?.serverTime || payload?.meta?.server_time || payload?.meta?.serverTime || payload?.current_time || payload?.currentTime;

    if (payloadServerTime) {
        return payloadServerTime;
    }

    return response?.headers?.get('date') || '';
}

function normalizeApprovalRequest(record, options = {}) {
    const person = getPerson(record);
    const reason = record?.out_of_office_reason || record?.reason || {};
    const fullName = person?.name || [person?.first_name, person?.last_name].filter(Boolean).join(' ').trim() || 'Unknown Employee';
    const avatarLabel = buildAvatarLabel(fullName);
    const statusTone = getStatusTone(record?.status);
    const statusLabel = getStatusLabel(record?.status, statusTone);
    const leaveToneKey = getLeaveToneKey(reason);
    const leaveLabel = reason?.full_label || reason?.display_label || reason?.reason_name || reason?.reason || reason?.name || reason?.label || 'Out of Office';

    return {
        id: String(record?.id || `${fullName}-${record?.start_date || 'request'}`),
        avatarLabel,
        avatarSource: approvalAvatarSources[avatarLabel],
        name: fullName,
        role: person?.job_title || person?.title || person?.role || 'Consultant',
        department: person?.department?.name || person?.department || 'Department unavailable',
        office: person?.office?.name || person?.office || 'Office unavailable',
        manager: person?.manager?.name || person?.manager_name || 'Manager unavailable',
        employeeId: person?.employee_id || person?.staff_id || 'N/A',
        leaveLabel,
        leaveToneKey,
        dateRange: formatDateRange(record?.start_date, record?.end_date),
        duration: getDurationLabel(record?.start_date, record?.end_date),
        durationLabel: getDurationLabel(record?.start_date, record?.end_date),
        submittedAt: formatDisplayDate(record?.created_at, { month: 'short', fallback: 'Recently submitted' }),
        serverNow: options.serverNow || '',
        reason: record?.comment || 'No additional comment provided.',
        reviewComment: record?.review?.comment || 'No additional comment provided.',
        reviewedAt: record?.review?.reviewed_at || null,
        reviewerName: record?.review?.reviewer?.name || '',
        reviewerEmail: record?.review?.reviewer?.email || '',
        canApprove: Boolean(record?.permissions?.can_approve),
        canReject: Boolean(record?.permissions?.can_reject),
        statusLabel,
        statusTone,
        raw: record,
    };
}

async function fetchPaginatedApprovalCollection({ endpoint, page = 1, perPage = 15, status, token, adminId }) {
    const query = new URLSearchParams({ page: String(page), per_page: String(perPage) });

    if (status) {
        query.set('status', status);
    }

    if (adminId != null && adminId !== '') {
        query.set('admin_id', String(adminId));
    }

    const {
        ok,
        payload,
        response,
        status: responseStatus,
    } = await apiRequest(`${endpoint}?${query.toString()}`, {
        method: 'GET',
        requiresAuth: true,
        token,
    });

    if (!ok) {
        const error = new Error(payload?.message || 'Unable to load approval requests right now.');
        error.status = responseStatus;
        error.payload = payload;
        throw error;
    }

    const meta = getPaginationMeta(payload);
    const serverNow = resolveServerNow(payload, response);

    return {
        items: getRecordsCollection(payload).map((record) => normalizeApprovalRequest(record, { serverNow })),
        meta: {
            currentPage: Number(meta?.current_page || 1),
            lastPage: Number(meta?.last_page || 1),
            perPage: Number(meta?.per_page || perPage),
            total: Number(meta?.total || 0),
        },
    };
}

export async function approveOutOfOfficeRequest({ holidayId, reviewComment = '', token }) {
    const { ok, payload, response, status } = await apiRequest(`${OUT_OF_OFFICE_ENDPOINT}/${holidayId}/approve`, {
        method: 'POST',
        requiresAuth: true,
        token,
        body: reviewComment ? { review_comment: reviewComment } : {},
    });

    if (!ok) {
        throw buildActionError(payload, 'Unable to approve this request right now.', status);
    }

    const record = payload?.data || payload?.record || payload;

    return normalizeApprovalRequest(record, { serverNow: resolveServerNow(payload, response) });
}

export async function rejectOutOfOfficeRequest({ holidayId, reviewComment = '', token }) {
    const { ok, payload, response, status } = await apiRequest(`${OUT_OF_OFFICE_ENDPOINT}/${holidayId}/reject`, {
        method: 'POST',
        requiresAuth: true,
        token,
        body: reviewComment ? { review_comment: reviewComment } : {},
    });

    if (!ok) {
        throw buildActionError(payload, 'Unable to reject this request right now.', status);
    }

    const record = payload?.data || payload?.record || payload;

    return normalizeApprovalRequest(record, { serverNow: resolveServerNow(payload, response) });
}

export async function fetchApprovalRequests({ page = 1, perPage = 15, status, token }) {
    return fetchPaginatedApprovalCollection({
        endpoint: OUT_OF_OFFICE_ENDPOINT,
        page,
        perPage,
        status,
        token,
    });
}

export async function fetchApprovalRequestsByAdmin({ adminId, page = 1, perPage = 15, status, token }) {
    return fetchPaginatedApprovalCollection({
        endpoint: OUT_OF_OFFICE_APPROVALS_ENDPOINT,
        adminId,
        page,
        perPage,
        status,
        token,
    });
}

export async function fetchApprovalRequestCounts({ adminId, perPage = 1, token }) {
    const statuses = ['all', 'pending', 'approved', 'rejected'];
    const entries = await Promise.all(
        statuses.map(async (status) => {
            const result = await fetchApprovalRequests({
                page: 1,
                perPage,
                status: status === 'all' ? undefined : status,
                token,
            });

            return [status, result.meta.total];
        })
    );

    if (adminId == null || adminId === '') {
        return Object.fromEntries(entries);
    }

    const byMeResult = await fetchApprovalRequestsByAdmin({
        adminId,
        page: 1,
        perPage,
        token,
    });

    return Object.fromEntries([...entries, ['by-me', byMeResult.meta.total]]);
}

export async function fetchApprovalRequestById({ holidayId, token }) {
    const { ok, payload, response, status } = await apiRequest(`${OUT_OF_OFFICE_ENDPOINT}/${holidayId}`, {
        method: 'GET',
        requiresAuth: true,
        token,
    });

    if (!ok) {
        throw buildActionError(payload, 'Unable to load this request right now.', status);
    }

    const record = payload?.data || payload?.record || payload;

    return normalizeApprovalRequest(record, { serverNow: resolveServerNow(payload, response) });
}
