import * as SecureStore from 'expo-secure-store';

const AUTH_SESSION_KEY = 'auth-session';

function buildInitials(firstName, lastName, name) {
    const firstInitial = firstName?.trim()?.charAt(0) || name?.trim()?.charAt(0) || '';
    const lastInitial = lastName?.trim()?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase() || 'IT';
}

export function getAuthProfile(user) {
    if (!user) {
        return null;
    }

    const fullName = user.name || [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
    const firstName = user.first_name || fullName.split(' ')[0] || '';
    const lastName = user.last_name || fullName.split(' ').slice(1).join(' ') || '';
    const isApproval = Array.isArray(user.roles) && user.roles.length > 0;
    const roleLabel = user.title || (isApproval ? 'Approval Personnel' : user.is_consultant ? 'Consultant' : 'User');
    const departmentLabel = user.department?.trim() || 'Nutrastat';

    return {
        fullName: fullName || 'iTravel User',
        firstName: firstName || 'User',
        lastName,
        email: user.email || '',
        title: roleLabel,
        department: departmentLabel,
        initials: buildInitials(firstName, lastName, fullName),
        isApproval,
        isConsultant: Boolean(user.is_consultant),
        rawUser: user,
    };
}

export async function saveAuthSession(session) {
    await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify(session));
}

export async function getAuthSession() {
    const rawSession = await SecureStore.getItemAsync(AUTH_SESSION_KEY);

    if (!rawSession) {
        return null;
    }

    try {
        return JSON.parse(rawSession);
    } catch {
        await clearAuthSession();
        return null;
    }
}

export async function clearAuthSession() {
    await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
}

export async function getStoredAuthProfile() {
    const session = await getAuthSession();
    return getAuthProfile(session?.user);
}
