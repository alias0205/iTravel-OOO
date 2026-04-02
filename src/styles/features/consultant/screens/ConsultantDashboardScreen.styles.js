import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 24,
    },
    pagePadding: {
        paddingHorizontal: 16,
        paddingTop: 18,
    },
    statusCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E6E9EE',
        padding: 16,
        marginBottom: 20,
        shadowColor: '#0C1320',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    statusHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    cardHeading: {
        color: '#394252',
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '800',
    },
    statusHeaderIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#DCFCE7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusBanner: {
        borderWidth: 1,
        borderColor: '#BBF7D0',
        backgroundColor: '#F0FDF4',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statusTitle: {
        color: '#1D6F2E',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
        marginBottom: 4,
    },
    statusSubtitle: {
        color: '#22C55E',
        fontSize: 16,
        lineHeight: 22,
    },
    statusDot: {
        width: 13,
        height: 13,
        borderRadius: 999,
        backgroundColor: '#22C55E',
    },
    metricRow: {
        flexDirection: 'row',
    },
    metricSpacer: {
        width: 12,
    },
    statusQuickStatsWrap: {
        marginTop: 18,
    },
    statusQuickStatsTitle: {
        color: '#394252',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '800',
        marginBottom: 12,
    },
    primaryActionCard: {
        backgroundColor: '#0A6B63',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 22,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#0A6B63',
        shadowOpacity: 0.16,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    primaryActionIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    primaryActionCopy: {
        flex: 1,
    },
    primaryActionTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
        marginBottom: 3,
    },
    primaryActionSubtitle: {
        color: 'rgba(255, 255, 255, 0.84)',
        fontSize: 14,
        lineHeight: 22,
    },
    quickStatsRow: {
        flexDirection: 'row',
        marginBottom: 22,
    },
    quickStatsSpacer: {
        width: 14,
    },
    upcomingCard: {
        backgroundColor: '#0A6B63',
        borderRadius: 16,
        padding: 18,
    },
    upcomingTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    upcomingLabel: {
        color: '#D8F2ED',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 4,
    },
    upcomingDates: {
        color: '#FFFFFF',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '800',
    },
    upcomingIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    upcomingMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    upcomingMetaText: {
        color: '#EAF8F5',
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 8,
    },
});

export { styles };
export default styles;
