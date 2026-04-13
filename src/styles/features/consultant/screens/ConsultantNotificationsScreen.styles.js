import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    headerAction: {
        color: '#0A6B63',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
    },
    settingsButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabRow: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E9EF',
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    tabItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabItemSpacing: {
        marginRight: 12,
    },
    tabItemActive: {
        borderBottomColor: '#0A6B63',
    },
    tabLabel: {
        color: '#4B5563',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '700',
    },
    tabLabelActive: {
        color: '#0A6B63',
    },
    tabCountBadge: {
        minWidth: 24,
        height: 24,
        paddingHorizontal: 6,
        borderRadius: 999,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    tabCountBadgeActive: {
        backgroundColor: '#D9F1EA',
    },
    tabCountText: {
        color: '#4B5563',
        fontSize: 12,
        lineHeight: 14,
        fontWeight: '700',
    },
    tabCountTextActive: {
        color: '#0A6B63',
    },
    scrollContent: {
        paddingBottom: 24,
    },
    pagePadding: {
        paddingHorizontal: 16,
        paddingTop: 18,
    },
    subHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    subHeaderText: {
        color: '#6B7280',
        fontSize: 15,
        lineHeight: 20,
    },
    clearAllText: {
        color: '#EF4444',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
    },
    emptyState: {
        color: '#6B7280',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        paddingVertical: 30,
    },
    notificationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E9EF',
        borderLeftWidth: 4,
        padding: 14,
        marginBottom: 14,
    },
    notificationHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    notificationIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    notificationCopy: {
        flex: 1,
    },
    notificationTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    notificationTitle: {
        color: '#1F2937',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
        flex: 1,
        paddingRight: 10,
    },
    notificationMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationTime: {
        color: '#6B7280',
        fontSize: 13,
        lineHeight: 18,
    },
    notificationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 8,
    },
    notificationMessage: {
        color: '#4B5563',
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 14,
    },
    notificationActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionButton: {
        minHeight: 34,
        borderRadius: 10,
        paddingHorizontal: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonPrimary: {
        backgroundColor: '#0A6B63',
    },
    actionButtonMuted: {
        backgroundColor: '#E5E7EB',
    },
    secondaryButton: {
        marginLeft: 10,
    },
    actionButtonText: {
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '700',
    },
    actionButtonTextPrimary: {
        color: '#FFFFFF',
    },
    actionButtonTextMuted: {
        color: '#4B5563',
    },
    loadMoreButton: {
        minHeight: 46,
        marginTop: 8,
        // marginBottom: 16,
        borderRadius: 14,
        backgroundColor: '#0A6B63',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadMoreButtonDisabled: {
        backgroundColor: '#7AA8A3',
    },
    loadMoreButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '800',
    },
});

export { styles };
export default styles;
