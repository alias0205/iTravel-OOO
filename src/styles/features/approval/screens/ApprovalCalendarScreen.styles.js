import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 120,
    },
    pagePadding: {
        paddingHorizontal: 16,
        paddingTop: 18,
    },
    monthControlCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 16,
        marginBottom: 16,
    },
    monthHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    monthArrowButton: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthLabel: {
        color: '#1F2937',
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '800',
    },
    monthLabelButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    yearPickerRow: {
        flexDirection: 'row',
        marginBottom: 14,
    },
    yearChip: {
        minWidth: 68,
        height: 34,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    yearChipActive: {
        borderColor: '#0A6B63',
        backgroundColor: '#D9F1EA',
    },
    yearChipText: {
        color: '#475569',
        fontSize: 13,
        lineHeight: 16,
        fontWeight: '700',
    },
    yearChipTextActive: {
        color: '#0A6B63',
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleButton: {
        minWidth: 76,
        height: 38,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    toggleButtonActive: {
        backgroundColor: '#0A6B63',
    },
    toggleButtonText: {
        color: '#475569',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '700',
    },
    toggleButtonTextActive: {
        color: '#FFFFFF',
    },
    filterButton: {
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    filterButtonActive: {
        backgroundColor: '#ECFDF5',
    },
    filterChipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 14,
    },
    filterChip: {
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    filterChipActive: {
        borderColor: '#0A6B63',
        backgroundColor: '#D9F1EA',
    },
    filterChipText: {
        color: '#475569',
        fontSize: 13,
        lineHeight: 16,
        fontWeight: '700',
    },
    filterChipTextActive: {
        color: '#0A6B63',
    },
    legendCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 18,
        marginBottom: 10,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 999,
        marginRight: 8,
    },
    legendLabel: {
        color: '#5B6575',
        fontSize: 14,
        lineHeight: 18,
    },
    calendarCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        marginBottom: 18,
    },
    weekdayHeaderRow: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    weekdayCell: {
        width: '14.2857%',
        paddingVertical: 10,
        alignItems: 'center',
    },
    weekdayText: {
        color: '#5B6575',
        fontSize: 13,
        lineHeight: 16,
        fontWeight: '700',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarCell: {
        width: '14.2857%',
        minHeight: 72,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: '#FFFFFF',
    },
    calendarCellHighlighted: {
        backgroundColor: '#E9F6F2',
        borderWidth: 2,
        borderColor: '#0A6B63',
    },
    calendarDayText: {
        color: '#111827',
        fontSize: 15,
        lineHeight: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    calendarDayTextMuted: {
        color: '#9CA3AF',
    },
    calendarDayTextHoliday: {
        color: '#9333EA',
    },
    cellEventsWrap: {
        gap: 4,
    },
    eventPill: {
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 2,
        alignSelf: 'flex-start',
        maxWidth: '100%',
    },
    eventPillSelf: {
        backgroundColor: '#0A6B63',
    },
    eventPillSelfSecondary: {
        backgroundColor: '#DCE8FA',
    },
    eventPillTeam: {
        backgroundColor: '#DCE8FA',
    },
    eventPillPending: {
        backgroundColor: '#FDE7D5',
    },
    eventPillText: {
        fontSize: 11,
        lineHeight: 14,
    },
    eventPillTextSelf: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    eventPillTextTeam: {
        color: '#2563EB',
    },
    eventPillTextPending: {
        color: '#C2410C',
    },
    holidayLabel: {
        color: '#9333EA',
        fontSize: 11,
        lineHeight: 14,
        marginTop: 2,
    },
    upcomingSectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 16,
        marginBottom: 8,
    },
    upcomingSectionTitle: {
        color: '#1F2937',
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '800',
        marginBottom: 16,
    },
    upcomingCardRow: {
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    upcomingCardRowHighlighted: {
        backgroundColor: '#F2FAF7',
        borderWidth: 1,
        borderColor: '#0A6B63',
    },
    upcomingAvatarWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    upcomingAvatarWrapTeam: {
        backgroundColor: '#DCE8FA',
    },
    upcomingAvatarWrapHoliday: {
        backgroundColor: '#F3E8FF',
    },
    upcomingAvatarWrapSelf: {
        backgroundColor: '#0A6B63',
    },
    upcomingCopy: {
        flex: 1,
    },
    upcomingName: {
        color: '#1F2937',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '700',
    },
    upcomingDate: {
        color: '#64748B',
        fontSize: 14,
        lineHeight: 20,
    },
    upcomingStatusDot: {
        width: 7,
        height: 7,
        borderRadius: 999,
    },
    upcomingStatusDotTeam: {
        backgroundColor: '#4B7BE8',
    },
    upcomingStatusDotHoliday: {
        backgroundColor: '#9333EA',
    },
    upcomingStatusDotSelf: {
        backgroundColor: '#0A6B63',
    },
    emptyState: {
        color: '#6B7280',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        paddingVertical: 12,
    },
    floatingActionButton: {
        position: 'absolute',
        right: 22,
        bottom: 92,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#0A6B63',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0A6B63',
        shadowOpacity: 0.28,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },
});

export { styles };
export default styles;
