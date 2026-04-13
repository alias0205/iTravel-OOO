import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 12,
    },
    pagePadding: {
        paddingHorizontal: 16,
        paddingTop: 18,
    },
    employeeCardInline: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    employeeCardTop: {
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingTop: 16,
    },
    employeeAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 14,
    },
    employeeAvatarFallback: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D7E3E1',
    },
    employeeAvatarText: {
        color: '#23434C',
        fontSize: 18,
        lineHeight: 20,
        fontWeight: '800',
    },
    employeeCopy: {
        flex: 1,
    },
    employeeName: {
        color: '#1F2937',
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '800',
        marginBottom: 2,
    },
    employeeRole: {
        color: '#4B5563',
        fontSize: 14,
        lineHeight: 20,
    },
    employeeMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    employeeMetaText: {
        flex: 1,
        color: '#6B7280',
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 8,
    },
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 16,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 14,
    },
    sectionTitle: {
        color: '#1F2937',
        fontSize: 17,
        lineHeight: 22,
        fontWeight: '800',
        marginLeft: 8,
    },
    sectionBody: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    summaryLabel: {
        color: '#6B7280',
        fontSize: 15,
        lineHeight: 20,
    },
    summaryValue: {
        color: '#1F2937',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '700',
        textAlign: 'right',
        flexShrink: 1,
        marginLeft: 12,
    },
    leaveTypeTag: {
        backgroundColor: '#F2E8FF',
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    leaveTypeTagText: {
        color: '#7D32DB',
        fontSize: 13,
        lineHeight: 16,
        fontWeight: '700',
        marginLeft: 4,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: 14,
    },
    reasonLabel: {
        color: '#6B7280',
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 8,
    },
    reasonText: {
        color: '#1F2937',
        fontSize: 15,
        lineHeight: 28,
    },
    reviewerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    reviewerAvatarFallback: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D7E3E1',
    },
    reviewerAvatarText: {
        color: '#23434C',
        fontSize: 16,
        lineHeight: 18,
        fontWeight: '800',
    },
    reviewerCopy: {
        flex: 1,
    },
    reviewerName: {
        color: '#1F2937',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
        marginBottom: 2,
    },
    reviewerRole: {
        color: '#475569',
        fontSize: 14,
        lineHeight: 20,
    },
    reviewerEmail: {
        color: '#64748B',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 2,
    },
    reviewerSummaryBox: {
        marginTop: 16,
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
    },
    reviewerSummaryBoxApproved: {
        borderColor: '#BBF7D0',
        backgroundColor: '#F0FDF4',
    },
    reviewerSummaryBoxRejected: {
        borderColor: '#FECACA',
        backgroundColor: '#FEF2F2',
    },
    reviewerSummaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewerSummaryTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        marginLeft: 8,
    },
    reviewerSummaryTitleApproved: {
        color: '#1B7841',
    },
    reviewerSummaryTitleRejected: {
        color: '#B42318',
    },
    reviewerSummaryNote: {
        fontSize: 14,
        lineHeight: 22,
    },
    reviewerSummaryNoteApproved: {
        color: '#238147',
    },
    reviewerSummaryNoteRejected: {
        color: '#B42318',
    },
    balanceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    balanceMetric: {
        width: '50%',
        alignItems: 'center',
        marginBottom: 16,
    },
    balanceMetricValue: {
        color: '#111827',
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    balanceMetricValueOrange: {
        color: '#EA580C',
    },
    balanceMetricValueGreen: {
        color: '#16A34A',
    },
    balanceMetricValueSlate: {
        color: '#475569',
    },
    balanceMetricLabel: {
        color: '#6B7280',
        fontSize: 14,
        lineHeight: 18,
        textAlign: 'center',
    },
    usageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    usageLabel: {
        color: '#6B7280',
        fontSize: 14,
        lineHeight: 18,
    },
    usageValue: {
        color: '#6B7280',
        fontSize: 14,
        lineHeight: 18,
    },
    progressTrack: {
        height: 8,
        borderRadius: 999,
        backgroundColor: '#D1D5DB',
        overflow: 'hidden',
    },
    progressFill: {
        width: '72%',
        height: '100%',
        borderRadius: 999,
        backgroundColor: '#0A6B63',
    },
    commentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 16,
        marginBottom: 22,
    },
    commentTitle: {
        color: '#1F2937',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '700',
        marginBottom: 12,
    },
    commentInput: {
        minHeight: 84,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: '#1F2937',
        fontSize: 15,
        lineHeight: 22,
    },
    commentInputDisabled: {
        backgroundColor: '#F8FAFC',
        color: '#64748B',
    },
    actionButton: {
        minHeight: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    actionButtonApprove: {
        backgroundColor: '#16A34A',
        marginBottom: 14,
    },
    actionButtonApproveText: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '800',
        marginLeft: 8,
    },
    secondaryActionRow: {
        marginBottom: 6,
    },
    actionButtonReject: {
        backgroundColor: '#EF4444',
    },
    actionButtonRejectText: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '800',
        marginLeft: 8,
    },
});

export { styles };
export default styles;
