const API_BASE_URL = 'https://ooo.nutrastat.com';
const LOGIN_ENDPOINT = '/api/auth/login';
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
    const response = await fetch(`${API_BASE_URL}${LOGIN_ENDPOINT}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email.trim(),
            password,
            device_name: deviceName,
        }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
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
