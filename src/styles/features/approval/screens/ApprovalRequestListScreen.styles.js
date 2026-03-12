import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 24,
    },
    pagePadding: {
        paddingHorizontal: 16,
        paddingTop: 18,
    },
    tabRow: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E9EF',
        paddingHorizontal: 16,
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        marginRight: 18,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
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
    emptyState: {
        color: '#6B7280',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        paddingVertical: 30,
    },
});

export { styles };
export default styles;
