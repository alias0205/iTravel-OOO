import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 0,
    },
    pagePadding: {
        paddingHorizontal: 16,
        paddingTop: 18,
    },
    metricsRow: {
        flexDirection: 'row',
        marginBottom: 26,
    },
    metricsSpacer: {
        width: 14,
    },
    infoState: {
        color: '#6B7280',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        paddingVertical: 24,
    },
    errorState: {
        color: '#B42318',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 12,
    },
    retryWrap: {
        paddingVertical: 12,
    },
    retryButton: {
        minHeight: 44,
        borderRadius: 12,
        backgroundColor: '#0A6B63',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '800',
    },
});

export { styles };
export default styles;
