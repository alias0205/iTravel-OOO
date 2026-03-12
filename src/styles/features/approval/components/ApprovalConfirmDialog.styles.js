import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.42)',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    dialogCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 18,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#0F172A',
        shadowOpacity: 0.14,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 12 },
        elevation: 12,
    },
    iconWrap: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 14,
    },
    title: {
        color: '#111827',
        fontSize: 20,
        lineHeight: 26,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        color: '#6B7280',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 18,
    },
    requestSummaryCard: {
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 18,
    },
    requestSummaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    requestSummaryLabel: {
        color: '#64748B',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
    },
    requestSummaryValue: {
        color: '#0F172A',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '700',
        marginLeft: 12,
        flexShrink: 1,
        textAlign: 'right',
    },
    actionsRow: {
        flexDirection: 'row',
    },
    actionButton: {
        flex: 1,
        minHeight: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#475569',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '800',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '800',
    },
});

export { styles };
export default styles;
