import { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, Pressable, Text, View } from 'react-native';

import { ApprovalScreenLayout } from '../components/ApprovalScreenLayout';
import { ApprovalCalendarScreenStyles as styles } from '../../../styles';
import {
    addDays,
    addMonths,
    availableYears,
    buildMonthCells,
    buildUpcomingItems,
    filterOptions,
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
    const eventStyle =
        tone === 'self' ? styles.eventPillSelf : tone === 'selfSecondary' ? styles.eventPillSelfSecondary : tone === 'pending' ? styles.eventPillPending : styles.eventPillTeam;

    const textStyle = tone === 'pending' ? styles.eventPillTextPending : tone === 'team' ? styles.eventPillTextTeam : styles.eventPillTextSelf;

    return (
        <View style={[styles.eventPill, eventStyle]}>
            <Text numberOfLines={1} style={[styles.eventPillText, textStyle]}>
                {label}
            </Text>
        </View>
    );
}

function UpcomingEventCard({ item }) {
    const avatarWrapStyle = item.tone === 'self' ? styles.upcomingAvatarWrapSelf : item.tone === 'holiday' ? styles.upcomingAvatarWrapHoliday : styles.upcomingAvatarWrapTeam;
    const avatarIconColor = item.tone === 'self' ? '#FFFFFF' : item.tone === 'holiday' ? '#9333EA' : '#4B7BE8';
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
                    item.tone === 'self' ? styles.upcomingStatusDotSelf : null,
                    item.tone === 'holiday' ? styles.upcomingStatusDotHoliday : null,
                    item.tone === 'team' || item.tone === 'pending' ? styles.upcomingStatusDotTeam : null,
                ]}
            />
        </View>
    );
}

export function ApprovalCalendarScreen({ navigation }) {
    const [viewMode, setViewMode] = useState('month');
    const [selectedMonth, setSelectedMonth] = useState(initialMonth);
    const [selectedDateKey, setSelectedDateKey] = useState(initialSelectedDate);
    const [activeFilter, setActiveFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    const monthCells = useMemo(() => buildMonthCells(selectedMonth, selectedDateKey, activeFilter), [activeFilter, selectedDateKey, selectedMonth]);

    const visibleCells = useMemo(() => {
        if (viewMode === 'month') {
            return monthCells;
        }

        const selectedDate = parseDateKey(selectedDateKey);
        const weekStart = addDays(selectedDate, -selectedDate.getDay());

        return Array.from({ length: 7 }, (_, index) => {
            const currentDate = addDays(weekStart, index);
            const dateKey = formatDateKey(currentDate);
            return (
                monthCells.find((cell) => cell.dateKey === dateKey) ?? {
                    date: currentDate,
                    dateKey,
                    day: currentDate.getDate(),
                    muted: !sameMonth(currentDate, selectedMonth),
                    highlighted: dateKey === selectedDateKey,
                    events: [],
                    holiday: null,
                }
            );
        });
    }, [monthCells, selectedDateKey, selectedMonth, viewMode]);

    const upcomingItems = useMemo(() => buildUpcomingItems(activeFilter, selectedDateKey), [activeFilter, selectedDateKey]);
    const selectedDate = useMemo(() => parseDateKey(selectedDateKey), [selectedDateKey]);
    const monthLabel = `${monthLabels[selectedMonth.getMonth()]} ${selectedMonth.getFullYear()}`;

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

    return (
        <ApprovalScreenLayout
            activeNavKey="calendar"
            // headerSubtitle="View leave coverage, holidays, and consultant availability"
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
                        <View style={styles.yearPickerRow}>
                            {availableYears.map((year) => (
                                <Pressable
                                    key={year}
                                    onPress={() => handleYearSelect(year)}
                                    style={[styles.yearChip, selectedMonth.getFullYear() === year ? styles.yearChipActive : null]}
                                >
                                    <Text style={[styles.yearChipText, selectedMonth.getFullYear() === year ? styles.yearChipTextActive : null]}>{year}</Text>
                                </Pressable>
                            ))}
                        </View>
                    ) : null}

                    <View style={styles.toggleRow}>
                        <Pressable onPress={() => setViewMode('month')} style={[styles.toggleButton, viewMode === 'month' ? styles.toggleButtonActive : null]}>
                            <Text style={[styles.toggleButtonText, viewMode === 'month' ? styles.toggleButtonTextActive : null]}>Month</Text>
                        </Pressable>
                        <Pressable onPress={() => setViewMode('week')} style={[styles.toggleButton, viewMode === 'week' ? styles.toggleButtonActive : null]}>
                            <Text style={[styles.toggleButtonText, viewMode === 'week' ? styles.toggleButtonTextActive : null]}>Week</Text>
                        </Pressable>
                        <Pressable onPress={() => setShowFilters((currentValue) => !currentValue)} style={[styles.filterButton, showFilters ? styles.filterButtonActive : null]}>
                            <MaterialCommunityIcons color="#4B5563" name="filter-variant" size={20} />
                        </Pressable>
                    </View>

                    {showFilters ? (
                        <View style={styles.filterChipsRow}>
                            {filterOptions.map((option) => (
                                <Pressable
                                    key={option.key}
                                    onPress={() => setActiveFilter(option.key)}
                                    style={[styles.filterChip, activeFilter === option.key ? styles.filterChipActive : null]}
                                >
                                    <Text style={[styles.filterChipText, activeFilter === option.key ? styles.filterChipTextActive : null]}>{option.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                    ) : null}
                </View>

                <View style={styles.legendCard}>
                    {legendItems.map((item) => (
                        <LegendItem color={item.color} key={item.key} label={item.label} />
                    ))}
                </View>

                <View style={styles.calendarCard}>
                    <View style={styles.weekdayHeaderRow}>
                        {weekdayLabels.map((label) => (
                            <View key={label} style={styles.weekdayCell}>
                                <Text style={styles.weekdayText}>{label}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.calendarGrid}>
                        {visibleCells.map((cell, index) => (
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

            <Pressable
                onPress={() => {
                    setActiveFilter('all');
                    setShowFilters(false);
                    setViewMode('month');
                    setSelectedMonth(initialMonth);
                    setSelectedDateKey(initialSelectedDate);
                    Alert.alert('Calendar Reset', 'Calendar filters and date selection have been reset.');
                }}
                style={styles.floatingActionButton}
            >
                <MaterialCommunityIcons color="#FFFFFF" name="plus" size={30} />
            </Pressable>
        </ApprovalScreenLayout>
    );
}
