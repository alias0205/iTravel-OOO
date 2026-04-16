import { apiRequest } from '../../../app/api/apiClient';

const NOTIFICATIONS_ENDPOINT = '/api/auth/notifications';

function buildNotificationError(payload, fallbackMessage, status) {
    const error = new Error(payload?.message || fallbackMessage);
    error.status = status;
    error.payload = payload;
    return error;
}

function normalizeNotification(record) {
    return {
        actionLabel: record?.action_label || 'Review',
        category: record?.category || 'requests',
        createdAt: record?.created_at || '',
        holidayId: record?.holiday_id || null,
        id: String(record?.id || ''),
        message: record?.message || '',
        readAt: record?.read_at || null,
        time: record?.time || 'Just now',
        title: record?.title || 'Notification',
        type: record?.type || '',
        unread: Boolean(record?.unread),
    };
}

export async function fetchApprovalNotifications({ token, limit = 15, page = 1, filter = 'all' }) {
    const searchParams = new URLSearchParams({
        filter,
        limit: String(limit),
        page: String(page),
    });

    const { ok, payload, status } = await apiRequest(`${NOTIFICATIONS_ENDPOINT}?${searchParams.toString()}`, {
        method: 'GET',
        requiresAuth: true,
        token,
    });

    if (!ok) {
        throw buildNotificationError(payload, 'Unable to load notifications right now.', status);
    }

    return {
        items: Array.isArray(payload?.data) ? payload.data.map(normalizeNotification) : [],
        meta: {
            currentPage: Number(payload?.meta?.current_page || page),
            filter: payload?.meta?.filter || filter,
            hasMore: Boolean(payload?.meta?.has_more),
            lastPage: Number(payload?.meta?.last_page || page),
            perPage: Number(payload?.meta?.per_page || limit),
            total: Number(payload?.meta?.total || 0),
            unreadCount: Number(payload?.meta?.unread_count || 0),
        },
        unreadCount: Number(payload?.meta?.unread_count || 0),
    };
}

export async function markApprovalNotificationAsRead({ notificationId, token }) {
    const { ok, payload, status } = await apiRequest(`${NOTIFICATIONS_ENDPOINT}/${notificationId}/read`, {
        method: 'POST',
        requiresAuth: true,
        token,
    });

    if (!ok) {
        throw buildNotificationError(payload, 'Unable to mark this notification as read.', status);
    }

    return normalizeNotification(payload?.data || {});
}

export async function markAllApprovalNotificationsAsRead({ token }) {
    const { ok, payload, status } = await apiRequest(`${NOTIFICATIONS_ENDPOINT}/read-all`, {
        method: 'POST',
        requiresAuth: true,
        token,
    });

    if (!ok) {
        throw buildNotificationError(payload, 'Unable to mark all notifications as read.', status);
    }
}

export async function clearAllApprovalNotifications({ token }) {
    const { ok, payload, status } = await apiRequest(`${NOTIFICATIONS_ENDPOINT}/clear-all`, {
        method: 'POST',
        requiresAuth: true,
        token,
    });

    if (!ok) {
        throw buildNotificationError(payload, 'Unable to clear notifications right now.', status);
    }

    return {
        deletedCount: Number(payload?.deleted_count || 0),
    };
}
