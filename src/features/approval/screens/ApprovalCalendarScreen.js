import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { ApprovalCalendarScreenStyles as styles } from '../../../styles';
import {
    addMonths,
    buildAvailableYears,
    buildPublicHolidayRecords,
    buildTimelineLayout,
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
import { fetchApprovedCalendarRequests } from '../utils/approvalRequestsApi';
import { useAuthSession } from '../../auth/context/AuthSessionContext';

const LegendItem = memo(function LegendItem({ color, label }) {
    return (
        <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>{label}</Text>
        </View>
    );
});

const EventPill = memo(function EventPill({ label }) {
    const eventStyle = styles.eventPillApproved;

    const textStyle = styles.eventPillTextApproved;

    return (
        <View style={[styles.eventPill, eventStyle]}>
            <Text numberOfLines={1} style={[styles.eventPillText, textStyle]}>
                {label}
            </Text>
        </View>
    );
});

const UpcomingEventCard = memo(function UpcomingEventCard({ item }) {
    const avatarWrapStyle = item.tone === 'holiday' ? styles.upcomingAvatarWrapHoliday : styles.upcomingAvatarWrapTeam;
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
                    item.tone === 'approved' ? styles.upcomingStatusDotTeam : null,
                ]}
            />
        </View>
    );
});

const TimelineBar = memo(function TimelineBar({ item }) {
    const barStyle = styles.timelineBarApproved;

    const textStyle = styles.timelineBarTextDefault;

    return (
        <View style={[styles.timelineBar, barStyle]}>
            <Text numberOfLines={1} style={[styles.timelineBarText, textStyle]}>
                {item.label}
            </Text>
        </View>
    );
});

export function ApprovalCalendarScreen({ navigation }) {
    const { session, signOut } = useAuthSession();
    const [viewMode, setViewMode] = useState('timeline');
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const [selectedDateKey, setSelectedDateKey] = useState(initialSelectedDate);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [showTimelineShortNames, setShowTimelineShortNames] = useState(false);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const yearPickerRef = useRef(null);
    const availableYears = useMemo(() => buildAvailableYears(approvedRequests), [approvedRequests]);
    const publicHolidayRecords = useMemo(() => buildPublicHolidayRecords(availableYears[0], availableYears[availableYears.length - 1]), [availableYears]);

    const monthCells = useMemo(() => buildMonthCells(selectedMonth, selectedDateKey, approvedRequests, publicHolidayRecords), [approvedRequests, publicHolidayRecords, selectedDateKey, selectedMonth]);
    const upcomingItems = useMemo(() => buildUpcomingItems(selectedMonth, approvedRequests, publicHolidayRecords), [approvedRequests, publicHolidayRecords, selectedMonth]);
    const timelineLayout = useMemo(() => buildTimelineLayout(selectedMonth, approvedRequests), [approvedRequests, selectedMonth]);
    const selectedDate = useMemo(() => parseDateKey(selectedDateKey), [selectedDateKey]);
    const monthLabel = `${monthLabels[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`;
    const selectedYearIndex = useMemo(() => availableYears.indexOf(selectedMonth.getFullYear()), [availableYears, selectedMonth]);
    const timelineDays = timelineLayout.days;
    const timelineRows = timelineLayout.rows;
    const timelineTrackWidth = timelineLayout.trackWidth;

    const loadCalendar = useCallback(async () => {
        if (!session?.token) {
            setApprovedRequests([]);
            setLoadError('');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setLoadError('');

        try {
            const records = await fetchApprovedCalendarRequests({ token: session.token });
            setApprovedRequests(Array.isArray(records) ? records : []);
        } catch (error) {
            if (error?.status === 401) {
                await signOut();
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Splash' }],
                });
                return;
            }

            setLoadError(error instanceof Error ? error.message : 'Unable to load calendar data right now.');
        } finally {
            setIsLoading(false);
        }
    }, [navigation, session?.token, signOut]);

    useFocusEffect(
        useCallback(() => {
            void loadCalendar();
        }, [loadCalendar])
    );

    const handleMonthChange = useCallback((step) => {
        const nextMonth = addMonths(selectedMonth, step);
        setSelectedMonth(nextMonth);
        setSelectedDateKey(formatDateKey(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1)));
    }, [selectedMonth]);

    const handleCellPress = useCallback((cell) => {
        setSelectedDateKey(cell.dateKey);

        if (!sameMonth(cell.date, selectedMonth)) {
            setSelectedMonth(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
        }
    }, [selectedMonth]);

    const handleYearSelect = useCallback((year) => {
        const nextMonth = new Date(year, selectedMonth.getMonth(), 1);
        setSelectedMonth(nextMonth);
        setSelectedDateKey(formatDateKey(new Date(year, selectedMonth.getMonth(), 1)));
        setShowYearPicker(false);
    }, [selectedMonth]);

    const handleViewToggle = useCallback(() => {
        setViewMode((currentValue) => (currentValue === 'month' ? 'timeline' : 'month'));
    }, []);

    const handleTimelineScroll = useCallback(({ nativeEvent }) => {
        const nextCompactState = nativeEvent.contentOffset.x > 12;

        setShowTimelineShortNames((currentValue) => (currentValue === nextCompactState ? currentValue : nextCompactState));
    }, []);

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

    const headerRight = useMemo(
        () => (
            <Pressable onPress={handleViewToggle} style={[styles.optionButton, styles.optionButtonActive]}>
                <MaterialCommunityIcons color="#0A6B63" name={viewMode === 'month' ? 'view-agenda-outline' : 'calendar-month-outline'} size={18} />
                <Text style={[styles.optionButtonText, styles.optionButtonTextActive]}>{viewMode === 'month' ? 'Timeline View' : 'Month View'}</Text>
            </Pressable>
        ),
        [handleViewToggle, viewMode]
    );

    const handleTimelineEventPress = useCallback(
        (request) => {
            if (!request) {
                return;
            }

            navigation.navigate('ApprovalRequestReview', { request });
        },
        [navigation]
    );

    return (
        <ApprovalScreenLayout
            activeNavKey="calendar"
            // headerSubtitle="Approved consultant requests and public holidays"
            headerRight={headerRight}
            headerTitle="Consultant Calendar"
            navigation={navigation}
            scrollContentStyle={styles.scrollContent}
            showBackButton
        >
            <View style={styles.pagePadding}>
                {loadError ? (
                    <View style={styles.upcomingSectionCard}>
                        <Text style={styles.emptyState}>{loadError}</Text>
                    </View>
                ) : null}

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
                        {isLoading ? (
                            <Text style={styles.emptyState}>Loading approved requests...</Text>
                        ) : timelineRows.length ? (
                            <View style={styles.timelineLayout}>
                                <View style={[styles.timelineFrozenColumn, showTimelineShortNames ? styles.timelineFrozenColumnCompact : null]}>
                                    <View style={[styles.timelineConsultantHeader, showTimelineShortNames ? styles.timelineConsultantHeaderCompact : null]}>
                                        <Text style={styles.timelineConsultantHeaderText}>{showTimelineShortNames ? 'Consult.' : 'Consultants'}</Text>
                                    </View>

                                    {timelineRows.map((row) => (
                                        <View key={`${row.id}-label`} style={[styles.timelineConsultantCell, showTimelineShortNames ? styles.timelineConsultantCellCompact : null, { height: row.height }]}>
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
                                            <View key={row.id} style={[styles.timelineRow, { height: row.height }]}>
                                                <View style={[styles.timelineTrack, { height: row.height, width: timelineTrackWidth }]}>
                                                    {timelineDays.map((day) => (
                                                        <View key={`${row.id}-${formatDateKey(day)}`} style={[styles.timelineGridCell, { height: row.height }]} />
                                                    ))}

                                                    <View pointerEvents="none" style={styles.timelineGridOverlay}>
                                                        {timelineDays.map((day) => (
                                                            <View key={`${row.id}-${formatDateKey(day)}-overlay`} style={styles.timelineGridOverlayCell} />
                                                        ))}
                                                    </View>

                                                    {row.positionedEvents.map((item) => (
                                                        <Pressable
                                                            key={item.id}
                                                            onPress={() => handleTimelineEventPress(item.request)}
                                                            style={[styles.timelineBarWrap, { height: 28, left: item.left, top: item.top, width: item.width }]}
                                                        >
                                                            <TimelineBar item={item} />
                                                        </Pressable>
                                                    ))}
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        ) : (
                            <Text style={styles.emptyState}>No approved consultant requests in this month.</Text>
                        )}
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

                                    {cell.events.length ? (
                                        <View style={styles.cellEventsWrap}>
                                            {cell.events.map((event) => (
                                                <EventPill key={event.id} label={event.label} />
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
                        {`Upcoming Events in ${monthLabels[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`}
                    </Text>

                    {upcomingItems.map((item) => (
                        <UpcomingEventCard item={item} key={item.id} />
                    ))}
                    {!upcomingItems.length ? <Text style={styles.emptyState}>{isLoading ? 'Loading calendar events...' : 'No upcoming events in the selected month.'}</Text> : null}
                </View>
            </View>
        </ApprovalScreenLayout>
    );
}
