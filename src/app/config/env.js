import { NativeModules, Platform } from 'react-native';

const FALLBACK_API_BASE_URL = 'https://ooo.nutrastat.com';
const LOCALHOST_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
const ANDROID_EMULATOR_HOST = '10.0.2.2';

function normalizeBaseUrl(value) {
    return (value || FALLBACK_API_BASE_URL).trim().replace(/\/+$/, '');
}

function getBundleHost() {
    const scriptUrl = NativeModules?.SourceCode?.scriptURL;

    if (!scriptUrl) {
        return null;
    }

    try {
        return new URL(scriptUrl).hostname || null;
    } catch {
        return null;
    }
}

function resolveDevelopmentHost(hostname) {
    if (!LOCALHOST_HOSTS.has(hostname)) {
        return hostname;
    }

    const bundleHost = getBundleHost();

    if (bundleHost && !LOCALHOST_HOSTS.has(bundleHost)) {
        return bundleHost;
    }

    if (Platform.OS === 'android') {
        return ANDROID_EMULATOR_HOST;
    }

    return hostname;
}

function resolveApiBaseUrl(value) {
    const normalizedValue = normalizeBaseUrl(value);

    try {
        const url = new URL(normalizedValue);

        if (!__DEV__) {
            return normalizedValue;
        }

        url.hostname = resolveDevelopmentHost(url.hostname);
        return url.toString().replace(/\/+$/, '');
    } catch {
        return normalizedValue;
    }
}

export const API_BASE_URL = resolveApiBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
