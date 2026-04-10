import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 0,
    },
    pagePadding: {
        paddingHorizontal: 16,
        paddingTop: 18,
    },
    heroCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E3E8EE',
        padding: 16,
        marginBottom: 16,
    },
    heroMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    heroDays: {
        color: '#6E7686',
        fontSize: 16,
        lineHeight: 22,
        marginLeft: 12,
    },
    heroActionRow: {
        flexDirection: 'row',
    },
    heroButton: {
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    heroButtonDisabled: {
        opacity: 0.55,
    },
    heroButtonMuted: {
        backgroundColor: '#0A6B63',
        marginRight: 10,
    },
    heroButtonDanger: {
        backgroundColor: '#FBE8E7',
    },
    heroButtonText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '700',
        marginLeft: 6,
    },
    heroButtonTextMuted: {
        color: '#FFFFFF',
    },
    heroButtonTextDanger: {
        color: '#D33A33',
    },
    fieldLabel: {
        color: '#414B5A',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        marginBottom: 6,
    },
    leaveTypeWrap: {
        marginBottom: 16,
    },
    leaveTypeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leaveTypeText: {
        color: '#242D39',
        fontSize: 16,
        lineHeight: 24,
        marginLeft: 6,
    },
    personRowWrap: {
        marginBottom: 16,
    },
    twoColumnRow: {
        flexDirection: 'row',
    },
    column: {
        flex: 1,
    },
    columnSpacer: {
        width: 14,
    },
    statusGroup: {
        marginTop: 2,
    },
    managerApprovalBox: {
        marginTop: 16,
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
    },
    managerApprovalBoxApproved: {
        borderColor: '#BBF7D0',
        backgroundColor: '#F0FDF4',
    },
    managerApprovalBoxRejected: {
        borderColor: '#FECACA',
        backgroundColor: '#FEF2F2',
    },
    managerApprovalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    managerApprovalTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        marginLeft: 8,
    },
    managerApprovalTitleApproved: {
        color: '#1B7841',
    },
    managerApprovalTitleRejected: {
        color: '#B42318',
    },
    managerApprovalNote: {
        fontSize: 14,
        lineHeight: 22,
    },
    managerApprovalNoteApproved: {
        color: '#238147',
    },
    managerApprovalNoteRejected: {
        color: '#B54708',
    },
    footerActionButton: {
        height: 52,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 12,
    },
    footerActionPrimary: {
        backgroundColor: '#0A6B63',
    },
    footerActionMuted: {
        backgroundColor: '#F1F3F6',
    },
    footerActionText: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '800',
        marginLeft: 8,
    },
    footerActionTextPrimary: {
        color: '#FFFFFF',
    },
    footerActionTextMuted: {
        color: '#4D5867',
    },
    footerActionTextBlue: {
        color: '#245FEA',
    },
});

export { styles };
export default styles;
