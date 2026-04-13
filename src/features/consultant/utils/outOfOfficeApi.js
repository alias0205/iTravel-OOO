import { apiRequest } from '../../../app/api/apiClient';
import { LEAVE_TYPE_ICON } from '../../../shared/constants/leaveTypeIcon';

const CREATE_OUT_OF_OFFICE_ENDPOINT = '/api/out-of-office';
const REVIEWED_STATUSES = new Set(['approved', 'rejected']);
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

function isReviewedStatus(statusTone) {
    return REVIEWED_STATUSES.has(statusTone);
}

function stripReasonCode(label) {
    if (typeof label !== 'string') {
        return 'Out of Office';
    }

    return label.replace(/^\s*[A-Za-z0-9]+\s*-\s*/, '').trim() || label.trim() || 'Out of Office';
}

function getLeaveToneKey(reason) {
    const source = `${reason?.code || ''} ${reason?.reason || reason?.label || ''}`.toLowerCase();

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

function getTonePalette(leaveToneKey) {
    const palette = {
        annual: { iconColor: 'blue', leaveTypeColor: '#2563EB' },
        sick: { iconColor: 'purple', leaveTypeColor: '#7D32DB' },
        business: { iconColor: 'blue', leaveTypeColor: '#2563EB' },
        remote: { iconColor: 'purple', leaveTypeColor: '#7D32DB' },
    };

    return palette[leaveToneKey] || palette.annual;
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
        month: options.month || 'long',
        day: 'numeric',
        year: options.includeYear === false ? undefined : 'numeric',
    });
}

function formatDisplayTime(dateValue) {
    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
        return 'N/A';
    }

    return parsedDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
}

function formatDisplayDateTime(dateValue, options = {}) {
    if (!dateValue) {
        return options.fallback || 'N/A';
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
        return options.fallback || 'N/A';
    }

    return `${formatDisplayDate(parsedDate, options)}, ${formatDisplayTime(parsedDate)}`;
}

function formatShortDateRange(startDate, endDate) {
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
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });

    if (sameMonth) {
        return `${startMonth} ${String(start.getDate()).padStart(2, '0')} - ${String(end.getDate()).padStart(2, '0')}`;
    }

    return `${startMonth} ${String(start.getDate()).padStart(2, '0')} - ${endMonth} ${String(end.getDate()).padStart(2, '0')}`;
}

function formatDateRange(startDate, endDate) {
    if (!startDate || !endDate) {
        return 'Date unavailable';
    }

    const shortRange = formatShortDateRange(startDate, endDate);
    const end = new Date(endDate);

    if (Number.isNaN(end.getTime())) {
        return shortRange;
    }

    return `${shortRange}, ${end.getFullYear()}`;
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

function formatMetaLabel(statusTone, createdAt, updatedAt, approverName) {
    if (statusTone === 'approved') {
        return approverName ? `Approved by ${approverName}` : `Approved · ${formatDisplayDate(updatedAt, { month: 'short', fallback: 'Recently' })}`;
    }

    if (statusTone === 'rejected') {
        return approverName ? `Rejected by ${approverName}` : 'Rejected';
    }

    return `Submitted ${formatDisplayDate(createdAt, { month: 'short', fallback: 'recently' })}`;
}

function getRequester(record) {
    return record?.user || {};
}

function getReviewer(record) {
    return record?.review?.reviewer || {};
}

function getReviewerName(reviewer) {
    return reviewer?.name || '';
}

function getReviewTimestamp(record, statusTone) {
    return isReviewedStatus(statusTone) ? record?.review?.reviewed_at || record?.updated_at : record?.updated_at;
}

function getApprovalSummary(statusTone, reviewerName, reviewComment, requestComment) {
    if (statusTone === 'approved') {
        return {
            icon: 'check-circle',
            iconColor: '#16A34A',
            title: `Approved${reviewerName ? ` by ${reviewerName}` : ''}`,
            note: reviewComment || 'No review comment provided.',
        };
    }

    if (statusTone === 'rejected') {
        return {
            icon: 'close-circle',
            iconColor: '#DC2626',
            title: `Rejected${reviewerName ? ` by ${reviewerName}` : ''}`,
            note: reviewComment || 'No review comment provided.',
        };
    }

    return {
        icon: 'clock-outline',
        iconColor: '#D97706',
        title: 'Pending manager review',
        note: requestComment || 'Your request is awaiting manager review.',
    };
}

function buildTimeline(record, statusTone, approverName) {
    const createdAtLabel = formatDisplayDateTime(record?.created_at, { fallback: 'Recently' });
    const updatedAtLabel = formatDisplayDateTime(getReviewTimestamp(record, statusTone), { fallback: 'Recently' });
    const timeline = [
        {
            title: 'Request Submitted',
            detail: 'Out of office request submitted for review',
            timestamp: createdAtLabel,
            tone: 'submitted',
        },
    ];

    if (statusTone === 'pending') {
        timeline.push({
            title: 'Pending Review',
            detail: approverName ? `Awaiting review from ${approverName}` : 'Awaiting approval review',
            timestamp: updatedAtLabel,
            tone: 'review',
        });
    }

    if (statusTone === 'approved') {
        timeline.push({
            title: 'Approved',
            detail: approverName ? `Approved by ${approverName}` : 'Request approved',
            timestamp: updatedAtLabel,
            tone: 'approved',
        });
    }

    if (statusTone === 'rejected') {
        timeline.push({
            title: 'Rejected',
            detail: approverName ? `Rejected by ${approverName}` : 'Request rejected',
            timestamp: updatedAtLabel,
            tone: 'rejected',
        });
    }

    return timeline;
}

function normalizeReasonId(reasonOption) {
    const rawReasonId = reasonOption?.raw?.id ?? reasonOption?.value;
    const numericReasonId = Number(rawReasonId);

    return Number.isFinite(numericReasonId) ? numericReasonId : rawReasonId;
}

function buildValidationMessage(payload) {
    if (typeof payload?.message === 'string' && payload.message.trim()) {
        return payload.message;
    }

    const firstFieldErrors = Object.values(payload?.errors || {}).find((fieldErrors) => Array.isArray(fieldErrors) && fieldErrors.length > 0);

    if (firstFieldErrors?.[0]) {
        return firstFieldErrors[0];
    }

    return 'Please review your request details and try again.';
}

function buildAvatarLabel(fullName) {
    const parts = String(fullName || '')
        .split(' ')
        .filter(Boolean);

    return `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase() || 'IT';
}

export async function createOutOfOfficeRequest({ comment = '', endDate, leaveReason, startDate, token }) {
    const { ok, payload, status } = await apiRequest(CREATE_OUT_OF_OFFICE_ENDPOINT, {
        method: 'POST',
        requiresAuth: true,
        token,
        body: {
            out_of_office_reason_id: normalizeReasonId(leaveReason),
            start_date: startDate,
            end_date: endDate,
            comment,
        },
    });

    if (!ok) {
        const error = new Error(buildValidationMessage(payload));
        error.status = status;
        error.payload = payload;
        throw error;
    }

    return payload;
}

export async function updateOutOfOfficeRequest({ comment = '', endDate, holidayId, leaveReason, startDate, token }) {
    const { ok, payload, status } = await apiRequest(`${CREATE_OUT_OF_OFFICE_ENDPOINT}/${holidayId}`, {
        method: 'PUT',
        requiresAuth: true,
        token,
        body: {
            out_of_office_reason_id: normalizeReasonId(leaveReason),
            start_date: startDate,
            end_date: endDate,
            comment,
        },
    });

    if (!ok) {
        const error = new Error(buildValidationMessage(payload));
        error.status = status;
        error.payload = payload;
        throw error;
    }

    return payload;
}

function normalizeOutOfOfficeRequest(record) {
    const reason = record?.reason || {};
    const requester = getRequester(record);
    const reviewer = getReviewer(record);
    const statusTone = getStatusTone(record?.status);
    const statusLabel = getStatusLabel(record?.status, statusTone);
    const leaveToneKey = getLeaveToneKey(reason);
    const tonePalette = getTonePalette(leaveToneKey);
    const reviewerName = getReviewerName(reviewer);
    const actorName = reviewerName;
    const leaveTypeLabel = stripReasonCode(reason?.label || reason?.reason || 'Out of Office');
    const employeeName = requester?.name || 'You';
    const managerName = actorName || 'Reviewer unavailable';
    const reviewComment = record?.review?.comment || '';
    const approvalSummary = getApprovalSummary(statusTone, actorName, reviewComment, record?.comment);

    return {
        id: String(record?.id || `${record?.start_date || 'request'}-${record?.end_date || 'request'}`),
        title: leaveTypeLabel,
        dateRange: formatDateRange(record?.start_date, record?.end_date),
        dateRangeShort: formatShortDateRange(record?.start_date, record?.end_date),
        startDate: formatDisplayDateTime(record?.start_date, { fallback: 'N/A' }),
        endDate: formatDisplayDateTime(record?.end_date, { fallback: 'N/A' }),
        duration: getDurationLabel(record?.start_date, record?.end_date),
        detail: record?.comment || leaveTypeLabel,
        reason: record?.comment || 'No additional comment provided.',
        meta: formatMetaLabel(statusTone, record?.created_at, record?.review?.reviewed_at || record?.updated_at, actorName),
        icon: LEAVE_TYPE_ICON,
        iconColor: tonePalette.iconColor,
        leaveTypeIcon: LEAVE_TYPE_ICON,
        leaveTypeColor: tonePalette.leaveTypeColor,
        leaveTypeLabel,
        statusLabel,
        statusTone,
        employeeName,
        employeeAvatarLabel: buildAvatarLabel(employeeName),
        employeeAvatarSource: undefined,
        managerName,
        managerEmail: reviewer?.email || 'Email unavailable',
        managerAvatarLabel: buildAvatarLabel(managerName),
        managerAvatarSource: undefined,
        managerApprovalIcon: approvalSummary.icon,
        managerApprovalIconColor: approvalSummary.iconColor,
        managerApprovalTitle: approvalSummary.title,
        managerApprovalNote: approvalSummary.note,
        timeline: buildTimeline(record, statusTone, actorName),
        canEdit: Boolean(record?.permissions?.can_edit),
        raw: record,
    };
}

export async function fetchOutOfOfficeRequests({ page = 1, perPage = 15, status, token }) {
    const query = new URLSearchParams({ page: String(page), per_page: String(perPage) });

    if (status) {
        query.set('status', status);
    }

    const {
        ok,
        payload,
        status: responseStatus,
    } = await apiRequest(`${CREATE_OUT_OF_OFFICE_ENDPOINT}?${query.toString()}`, {
        method: 'GET',
        requiresAuth: true,
        token,
    });

    if (!ok) {
        const error = new Error(payload?.message || 'Unable to load requests right now.');
        error.status = responseStatus;
        error.payload = payload;
        throw error;
    }

    const meta = getPaginationMeta(payload);

    return {
        items: getRecordsCollection(payload).map(normalizeOutOfOfficeRequest),
        meta: {
            currentPage: Number(meta?.current_page || 1),
            lastPage: Number(meta?.last_page || 1),
            perPage: Number(meta?.per_page || perPage),
            total: Number(meta?.total || 0),
        },
    };
}

export async function fetchOutOfOfficeRequestById({ holidayId, token }) {
    const { ok, payload, status } = await apiRequest(`${CREATE_OUT_OF_OFFICE_ENDPOINT}/${holidayId}`, {
        method: 'GET',
        requiresAuth: true,
        token,
    });

    if (!ok) {
        const error = new Error(payload?.message || 'Unable to load this request right now.');
        error.status = status;
        error.payload = payload;
        throw error;
    }

    return normalizeOutOfOfficeRequest(payload?.data || payload);
}

export async function fetchOutOfOfficeRequestCounts({ perPage = 1, token }) {
    const statuses = ['all', 'pending', 'approved', 'rejected'];
    const entries = await Promise.all(
        statuses.map(async (status) => {
            const result = await fetchOutOfOfficeRequests({
                page: 1,
                perPage,
                status: status === 'all' ? undefined : status,
                token,
            });

            return [status, result.meta.total];
        })
    );

    return Object.fromEntries(entries);
}
