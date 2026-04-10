import { useEffect, useMemo, useRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { ApprovalCalendarScreenStyles as styles } from '../../../styles';
import {
    addMonths,
    buildAvailableYears,
    buildTimelineRows,
    buildMonthCells,
    buildUpcomingItems,
    formatDateKey,
    initialMonth,
    initialSelectedDate,
    legendItems,
    monthLabels,
    parseDateKey,
    sameMonth,
    weekdayLabels,
} from '../utils/approvalCalendarUtils';

function LegendItem({ color, label }) {
    return (
        <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{label}</Text>
        </View>
    );
}

function EventPill({ label, tone }) {
    const eventStyle = tone === 'pending' ? styles.eventPillPending : styles.eventPillApproved;

    const textStyle = tone === 'pending' ? styles.eventPillTextPending : styles.eventPillTextApproved;

    return (
        <View style={[styles.eventPill, eventStyle]}>
            <Text numberOfLines={1} style={[styles.eventPillText, textStyle]}>
                {label}
            </Text>
        </View>
    );
}

function UpcomingEventCard({ item }) {
    const avatarWrapStyle = item.tone === 'holiday' ? styles.upcomingAvatarWrapHoliday : styles.upcomingAvatarWrapApproved;
    const avatarIconColor = item.tone === 'holiday' ? '#9333EA' : '#4B7BE8';
    const iconName = item.tone === 'holiday' ? 'calendar-star' : 'account';

    return (
        <View style={[styles.upcomingCardRow, item.highlighted ? styles.upcomingCardRowHighlighted : null]}>
            <View style={[styles.upcomingAvatarWrap, avatarWrapStyle]}>
                <MaterialCommunityIcons color={avatarIconColor} name={iconName} size={20} />
            </View>

            <View style={styles.upcomingCopy}>
                <Text style={styles.upcomingName}>{item.name}</Text>
                <Text style={styles.upcomingDate}>{item.date}</Text>
            </View>

            <View
                style={[
                    styles.upcomingStatusDot,
                    item.tone === 'holiday' ? styles.upcomingStatusDotHoliday : null,
                    item.tone === 'approved' || item.tone === 'pending' ? styles.upcomingStatusDotApproved : null,
                ]}
            />
        </View>
    );
}

function TimelineBar({ item, tone }) {
    const barStyle = tone === 'pending' ? styles.timelineBarPending : styles.timelineBarApproved;

    const textStyle = tone === 'pending' ? styles.timelineBarTextPending : styles.timelineBarTextDefault;

    return (
        <View style={[styles.timelineBar, barStyle]}>
            <Text numberOfLines={1} style={[styles.timelineBarText, textStyle]}>
                {item.label}
            </Text>
        </View>
    );
}

export function ApprovalCalendarScreen({ navigation }) {
    const [viewMode, setViewMode] = useState('timeline');
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const [selectedDateKey, setSelectedDateKey] = useState(initialSelectedDate);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showTimelineShortNames, setShowTimelineShortNames] = useState(false);
    const yearPickerRef = useRef(null);
    const availableYears = useMemo(() => buildAvailableYears(), []);
    const activeFilter = 'all';

    const monthCells = useMemo(() => buildMonthCells(selectedMonth, selectedDateKey, activeFilter), [activeFilter, selectedDateKey, selectedMonth]);

    const upcomingItems = useMemo(() => buildUpcomingItems(activeFilter, selectedDateKey), [activeFilter, selectedDateKey]);
    const timelineRows = useMemo(() => buildTimelineRows(selectedMonth, activeFilter), [activeFilter, selectedMonth]);
    const selectedDate = useMemo(() => parseDateKey(selectedDateKey), [selectedDateKey]);
    const monthLabel = `${monthLabels[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`;
    const selectedYearIndex = useMemo(() => availableYears.indexOf(selectedMonth.getFullYear()), [availableYears, selectedMonth]);
    const daysInMonth = useMemo(() => new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate(), [selectedMonth]);
    const timelineDays = useMemo(
        () => Array.from({ length: daysInMonth }, (_, index) => new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), index + 1)),
        [daysInMonth, selectedMonth]
    );
    const timelineTrackWidth = timelineDays.length * 56;

    const handleMonthChange = (step) => {
        const nextMonth = addMonths(selectedMonth, step);
        setSelectedMonth(nextMonth);
        setSelectedDateKey(formatDateKey(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1)));
    };

    const handleCellPress = (cell) => {
        setSelectedDateKey(cell.dateKey);

        if (!sameMonth(cell.date, selectedMonth)) {
            setSelectedMonth(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
        }
    };

    const handleYearSelect = (year) => {
        const nextMonth = new Date(year, selectedMonth.getMonth(), 1);
        setSelectedMonth(nextMonth);
        setSelectedDateKey(formatDateKey(new Date(year, selectedMonth.getMonth(), 1)));
        setShowYearPicker(false);
    };

    const handleViewToggle = () => {
        setViewMode((currentValue) => (currentValue === 'month' ? 'timeline' : 'month'));
    };

    const handleTimelineScroll = ({ nativeEvent }) => {
        const nextCompactState = nativeEvent.contentOffset.x > 12;

        setShowTimelineShortNames((currentValue) => (currentValue === nextCompactState ? currentValue : nextCompactState));
    };

    useEffect(() => {
        if (!showYearPicker || !yearPickerRef.current || selectedYearIndex < 0) {
            return;
        }

        const chipWidth = 76;
        const targetOffset = Math.max(selectedYearIndex * chipWidth - chipWidth, 0);

        const frameId = requestAnimationFrame(() => {
            yearPickerRef.current?.scrollTo({ animated: false, x: targetOffset, y: 0 });
        });

        return () => cancelAnimationFrame(frameId);
    }, [selectedYearIndex, showYearPicker]);

    const headerRight = (
        <Pressable onPress={handleViewToggle} style={[styles.optionButton, styles.optionButtonActive]}>
            <MaterialCommunityIcons color="#0A6B63" name={viewMode === 'month' ? 'view-agenda-outline' : 'calendar-month-outline'} size={18} />
            <Text style={[styles.optionButtonText, styles.optionButtonTextActive]}>{viewMode === 'month' ? 'Timeline View' : 'Month View'}</Text>
        </Pressable>
    );

    return (
        <ApprovalScreenLayout
            activeNavKey="calendar"
            // headerSubtitle="View leave coverage, holidays, and consultant availability"
            headerRight={headerRight}
            headerTitle="Consultant Calendar"
            navigation={navigation}
            notificationCount={8}
            scrollContentStyle={styles.scrollContent}
            showBackButton
        >
            <View style={styles.pagePadding}>
                <View style={styles.monthControlCard}>
                    <View style={styles.monthHeaderRow}>
                        <Pressable onPress={() => handleMonthChange(-1)} style={styles.monthArrowButton}>
                            <MaterialCommunityIcons color="#475569" name="chevron-left" size={22} />
                        </Pressable>
                        <Pressable onPress={() => setShowYearPicker((currentValue) => !currentValue)} style={styles.monthLabelButton}>
                            <Text style={styles.monthLabel}>{monthLabel}</Text>
                            <MaterialCommunityIcons color="#475569" name={showYearPicker ? 'chevron-up' : 'chevron-down'} size={18} />
                        </Pressable>
                        <Pressable onPress={() => handleMonthChange(1)} style={styles.monthArrowButton}>
                            <MaterialCommunityIcons color="#475569" name="chevron-right" size={22} />
                        </Pressable>
                    </View>

                    {showYearPicker ? (
                        <ScrollView
                            ref={yearPickerRef}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.yearPickerRow}
                            contentContainerStyle={styles.yearPickerContent}
                        >
                            {availableYears.map((year) => (
                                <Pressable
                                    key={year}
                                    onPress={() => handleYearSelect(year)}
                                    style={[styles.yearChip, selectedMonth.getFullYear() === year ? styles.yearChipActive : null]}
                                >
                                    <Text style={[styles.yearChipText, selectedMonth.getFullYear() === year ? styles.yearChipTextActive : null]}>{year}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    ) : null}
                </View>

                <View style={styles.legendCard}>
                    {legendItems.map((item) => (
                        <LegendItem color={item.color} key={item.key} label={item.label} />
                    ))}
                </View>

                {viewMode === 'timeline' ? (
                    <View style={styles.calendarCard}>
                        <View style={styles.timelineLayout}>
                            <View style={[styles.timelineFrozenColumn, showTimelineShortNames ? styles.timelineFrozenColumnCompact : null]}>
                                <View style={[styles.timelineConsultantHeader, showTimelineShortNames ? styles.timelineConsultantHeaderCompact : null]}>
                                    <Text style={styles.timelineConsultantHeaderText}>{showTimelineShortNames ? 'Consult.' : 'Consultants'}</Text>
                                </View>

                                {timelineRows.map((row) => (
                                    <View key={`${row.id}-label`} style={[styles.timelineConsultantCell, showTimelineShortNames ? styles.timelineConsultantCellCompact : null]}>
                                        <Text
                                            numberOfLines={showTimelineShortNames ? 1 : 2}
                                            style={showTimelineShortNames ? styles.timelineConsultantShortName : styles.timelineConsultantFullName}
                                        >
                                            {showTimelineShortNames ? row.shortName : row.name}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <ScrollView horizontal onScroll={handleTimelineScroll} scrollEventThrottle={16} showsHorizontalScrollIndicator style={styles.timelineScrollableArea}>
                                <View>
                                    <View style={[styles.timelineDaysWrap, { width: timelineTrackWidth }]}>
                                        {timelineDays.map((day) => (
                                            <View key={formatDateKey(day)} style={styles.timelineDayHeaderCell}>
                                                <Text style={styles.timelineDayHeaderTop}>{weekdayLabels[day.getDay()]}</Text>
                                                <Text style={styles.timelineDayHeaderBottom}>{day.getDate()}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    {timelineRows.map((row) => (
                                        <View key={row.id} style={styles.timelineRow}>
                                            <View style={[styles.timelineTrack, { width: timelineTrackWidth }]}>
                                                {timelineDays.map((day) => (
                                                    <View key={`${row.id}-${formatDateKey(day)}`} style={styles.timelineGridCell} />
                                                ))}

                                                <View pointerEvents="none" style={styles.timelineGridOverlay}>
                                                    {timelineDays.map((day) => (
                                                        <View key={`${row.id}-${formatDateKey(day)}-overlay`} style={styles.timelineGridOverlayCell} />
                                                    ))}
                                                </View>

                                                {row.events.map((item) => {
                                                    const startDate = parseDateKey(item.startDateKey);
                                                    const endDate = parseDateKey(item.endDateKey);
                                                    const visibleStart = startDate < timelineDays[0] ? timelineDays[0] : startDate;
                                                    const visibleEnd = endDate > timelineDays[timelineDays.length - 1] ? timelineDays[timelineDays.length - 1] : endDate;
                                                    const startOffset = visibleStart.getDate() - 1;
                                                    const spanDays = visibleEnd.getDate() - visibleStart.getDate() + 1;

                                                    return (
                                                        <Pressable
                                                            key={item.id}
                                                            onPress={() => navigation.navigate('ApprovalRequestReview', { request: item.request })}
                                                            style={[
                                                                styles.timelineBarWrap,
                                                                {
                                                                    left: startOffset * 56,
                                                                    width: Math.max(spanDays * 56 - 6, 50),
                                                                },
                                                            ]}
                                                        >
                                                            <TimelineBar item={item} tone={item.tone} />
                                                        </Pressable>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                ) : (
                    <View style={styles.calendarCard}>
                        <View style={styles.weekdayHeaderRow}>
                            {weekdayLabels.map((label) => (
                                <View key={label} style={styles.weekdayCell}>
                                    <Text style={styles.weekdayText}>{label}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.calendarGrid}>
                            {monthCells.map((cell, index) => (
                                <Pressable
                                    key={`${cell.dateKey}-${index}`}
                                    onPress={() => handleCellPress(cell)}
                                    style={[styles.calendarCell, cell.highlighted ? styles.calendarCellHighlighted : null]}
                                >
                                    <Text style={[styles.calendarDayText, cell.muted ? styles.calendarDayTextMuted : null, cell.holiday ? styles.calendarDayTextHoliday : null]}>
                                        {cell.day}
                                    </Text>

                                    {cell.events ? (
                                        <View style={styles.cellEventsWrap}>
                                            {cell.events.map((event) => (
                                                <EventPill key={event.label} label={event.label} tone={event.tone} />
                                            ))}
                                        </View>
                                    ) : null}

                                    {cell.holiday ? <Text style={styles.holidayLabel}>{cell.holiday}</Text> : null}
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.upcomingSectionCard}>
                    <Text style={styles.upcomingSectionTitle}>
                        {upcomingItems.length ? `Events on ${monthLabels[selectedDate.getMonth()].slice(0, 3)} ${selectedDate.getDate()}` : 'Upcoming Team Events'}
                    </Text>

                    {upcomingItems.map((item) => (
                        <UpcomingEventCard item={item} key={item.id} />
                    ))}
                    {!upcomingItems.length ? <Text style={styles.emptyState}>No calendar events match the current selection.</Text> : null}
                </View>
            </View>
        </ApprovalScreenLayout>
    );
}
