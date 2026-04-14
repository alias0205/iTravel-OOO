import { apiRequest } from '../../../app/api/apiClient';

const LOGIN_ENDPOINT = '/api/auth/login';
const PROFILE_ENDPOINT = '/api/auth/me';
const CHANGE_PASSWORD_ENDPOINT = '/api/auth/change-password';
const DEFAULT_DEVICE_NAME = 'Mobile App';

export function getLoginRoute(user) {
    if (Array.isArray(user?.roles) && user.roles.length > 0) {
        return 'ApprovalDashboard';
    }

    if (user?.is_consultant) {
        return 'ConsultantDashboard';
    }

    return null;
}

export async function loginWithPassword({ email, password, deviceName = DEFAULT_DEVICE_NAME }) {
    const { ok, payload } = await apiRequest(LOGIN_ENDPOINT, {
        method: 'POST',
        body: {
            email: email.trim(),
            password,
            device_name: deviceName,
        },
    });

    if (!ok) {
        throw new Error(payload?.message || 'Unable to sign in. Please check your credentials and try again.');
    }

    const nextRouteName = getLoginRoute(payload?.user);

    if (!nextRouteName) {
        throw new Error('Your account does not have a supported mobile role.');
    }

    return {
        message: payload?.message || 'Login successful.',
        token: payload?.token || '',
        tokenType: payload?.token_type || 'Bearer',
        user: payload?.user || null,
        nextRouteName,
    };
}

export async function fetchCurrentUserProfile({ token }) {
    const { ok, payload, status } = await apiRequest(PROFILE_ENDPOINT, {
        method: 'GET',
        requiresAuth: true,
        token,
    });

    if (!ok) {
        const error = new Error(payload?.message || 'Unable to load your profile right now.');
        error.status = status;
        error.payload = payload;
        throw error;
    }

    return payload?.user || null;
}

export async function updateCurrentUserProfile({ email, firstName, lastName, token }) {
    const { ok, payload, status } = await apiRequest(PROFILE_ENDPOINT, {
        method: 'PATCH',
        requiresAuth: true,
        token,
        body: {
            email: email.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
        },
    });

    if (!ok) {
        const message =
            payload?.message || Object.values(payload?.errors || {}).find((fieldErrors) => Array.isArray(fieldErrors) && fieldErrors.length > 0)?.[0] || 'Unable to update your profile.';
        const error = new Error(message);
        error.status = status;
        error.payload = payload;
        throw error;
    }

    return {
        message: payload?.message || 'Profile updated successfully.',
        user: payload?.user || null,
    };
}

export async function updateCurrentUserPassword({ currentPassword, newPassword, passwordConfirmation, token }) {
    const { ok, payload, status } = await apiRequest(CHANGE_PASSWORD_ENDPOINT, {
        method: 'POST',
        requiresAuth: true,
        token,
        body: {
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: passwordConfirmation,
        },
    });

    if (!ok) {
        const message =
            payload?.message || Object.values(payload?.errors || {}).find((fieldErrors) => Array.isArray(fieldErrors) && fieldErrors.length > 0)?.[0] || 'Unable to update your password.';
        const error = new Error(message);
        error.status = status;
        error.payload = payload;
        throw error;
    }

    return {
        message: payload?.message || 'Password updated successfully.',
    };
}
