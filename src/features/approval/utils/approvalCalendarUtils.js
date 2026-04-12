export const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const legendItems = [
    { key: 'approved', label: 'Approved', color: '#4B7BE8' },
    { key: 'pending', label: 'Pending', color: '#F97316' },
    { key: 'holiday', label: 'Public Holiday', color: '#A855F7' },
];

const eventRecords = [
    {
        id: 'john-vacation',
        leaveCode: 'JSM001',
        shortLabel: 'John S.',
        title: 'John Smith - Vacation',
        summary: 'Dec 5-6, 2024',
        type: 'approved',
        dates: ['2024-12-05', '2024-12-06'],
    },
    {
        id: 'maria-personal',
        leaveCode: 'MGR001',
        shortLabel: 'Maria G.',
        title: 'Maria Garcia - Personal Day',
        summary: 'Dec 13, 2024',
        type: 'approved',
        dates: ['2024-12-13', '2024-12-15'],
    },
    {
        id: 'amy-annual',
        leaveCode: 'AXC001',
        shortLabel: 'Amy C.',
        title: 'Amy Crew - Annual Leave',
        summary: 'Dec 8-10, 2024',
        type: 'approved',
        dates: ['2024-12-08', '2024-12-09', '2024-12-10'],
    },
    {
        id: 'callum-annual',
        leaveCode: 'CXT001',
        shortLabel: 'Callum T2.',
        title: 'Callum Thurman - Annual Leave',
        summary: 'Dec 9-17, 2024',
        type: 'approved',
        dates: ['2024-12-09', '2024-12-10', '2024-12-11', '2024-12-12', '2024-12-13', '2024-12-14', '2024-12-15', '2024-12-16', '2024-12-17'],
    },
    {
        id: 'callum-personal',
        leaveCode: 'CXT002',
        shortLabel: 'Callum T1.',
        title: 'Callum Thurman - Personal Leave',
        summary: 'Dec 13-20, 2024',
        type: 'approved',
        dates: ['2024-12-13', '2024-12-14', '2024-12-15', '2024-12-16', '2024-12-17', '2024-12-18', '2024-12-19', '2024-12-20'],
    },
    {
        id: 'callum-remote',
        leaveCode: 'CXT003',
        shortLabel: 'Callum T3.',
        title: 'Callum Thurman - Remote Planning',
        summary: 'Dec 14-21, 2024',
        type: 'approved',
        dates: ['2024-12-14', '2024-12-15', '2024-12-16', '2024-12-17', '2024-12-18', '2024-12-19', '2024-12-20', '2024-12-21'],
    },
    {
        id: 'callum-sick',
        leaveCode: 'CXT006',
        shortLabel: 'Callum T4.',
        title: 'Callum Thurman - Sick Leave',
        summary: 'Dec 9-18, 2024',
        type: 'approved',
        dates: ['2024-12-09', '2024-12-10', '2024-12-11', '2024-12-12', '2024-12-13', '2024-12-14', '2024-12-15', '2024-12-16', '2024-12-17', '2024-12-18'],
    },
    {
        id: 'george-remote',
        leaveCode: 'GRM001',
        shortLabel: 'George M.',
        title: 'George Mason - Remote Planning',
        summary: 'Dec 4-6, 2024',
        type: 'pending',
        dates: ['2024-12-04', '2024-12-05', '2024-12-06'],
    },
    {
        id: 'graham-annual',
        leaveCode: 'GLH001',
        shortLabel: 'Graham H.',
        title: 'Graham Hobson - Annual Leave',
        summary: 'Dec 20-23, 2024',
        type: 'approved',
        dates: ['2024-12-20', '2024-12-21', '2024-12-22', '2024-12-23'],
    },
    {
        id: 'jack-sick',
        leaveCode: 'JSB001',
        shortLabel: 'Jack B.',
        title: 'Jack Baker - Sick Leave',
        summary: 'Dec 11-12, 2024',
        type: 'pending',
        dates: ['2024-12-11', '2024-12-12'],
    },
];

const holidayRecords = [
    { id: 'christmas', date: '2024-12-25', title: 'Christmas Day', summary: 'Dec 25, 2024' },
    { id: 'boxing-day', date: '2024-12-26', title: 'Boxing Day', summary: 'Dec 26, 2024' },
    { id: 'new-year', date: '2025-01-01', title: "New Year's Day", summary: 'Jan 1, 2025' },
];

const DAY_WIDTH = 56;
const calendarDataCache = new Map();
const timelineLayoutCache = new Map();

export function buildAvailableYears(startYear = 2000, endYear = 2050) {
    return Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
}

export const initialMonth = new Date(2024, 11, 1);
export const initialSelectedDate = '2024-12-18';

export function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey) {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export function addDays(date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function addMonths(date, months) {
    return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function formatDisplayDate(dateValue, options = {}) {
    if (!dateValue) {
        return options.fallback || 'N/A';
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
        return options.fallback || 'N/A';
    }

    return parsedDate.toLocaleDateString('en-US', {
        month: options.month || 'short',
        day: '2-digit',
        year: options.includeYear === false ? undefined : 'numeric',
    });
}

function formatDateRange(startDate, endDate) {
    if (!startDate || !endDate) {
        return 'Date unavailable';
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return 'Date unavailable';
    }

    const sameYearValue = start.getFullYear() === end.getFullYear();
    const sameMonthValue = sameYearValue && start.getMonth() === end.getMonth();

    if (sameMonthValue) {
        const month = start.toLocaleDateString('en-US', { month: 'short' });
        return `${month} ${String(start.getDate()).padStart(2, '0')} - ${String(end.getDate()).padStart(2, '0')}, ${end.getFullYear()}`;
    }

    if (sameYearValue) {
        return `${formatDisplayDate(startDate, { includeYear: false })} - ${formatDisplayDate(endDate)}, ${end.getFullYear()}`.replace(', ', ' ');
    }

    return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
}

function getDurationLabel(startDate, endDate) {
    if (!startDate || !endDate) {
        return 'N/A';
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return 'N/A';
    }

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const days =
        Math.floor((new Date(end.getFullYear(), end.getMonth(), end.getDate()) - new Date(start.getFullYear(), start.getMonth(), start.getDate())) / millisecondsPerDay) + 1;

    if (days <= 0) {
        return 'N/A';
    }

    return `${days} ${days === 1 ? 'day' : 'days'}`;
}

export function sameMonth(dateA, dateB) {
    return dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth();
}

function buildEventMap(activeFilter) {
    const eventMap = {};

    eventRecords.forEach((event) => {
        if (activeFilter !== 'all' && activeFilter !== event.type) {
            return;
        }

        event.dates.forEach((date) => {
            if (!eventMap[date]) {
                eventMap[date] = [];
            }

            eventMap[date].push({
                id: event.id,
                label: event.shortLabel,
                title: event.title,
                summary: event.summary,
                tone: event.displayTone ?? event.type,
                type: event.type,
            });
        });
    });

    return eventMap;
}

function buildHolidayMap(activeFilter) {
    if (activeFilter !== 'all' && activeFilter !== 'holiday') {
        return {};
    }

    return holidayRecords.reduce((accumulator, holiday) => {
        accumulator[holiday.date] = holiday;
        return accumulator;
    }, {});
}

function buildFallbackUpcomingItems(activeFilter) {
    const events = eventRecords
        .filter((event) => activeFilter === 'all' || activeFilter === event.type)
        .map((event) => ({
            id: event.id,
            name: event.title,
            date: event.summary,
            tone: event.type,
            highlighted: false,
        }));

    if (activeFilter === 'all' || activeFilter === 'holiday') {
        holidayRecords.forEach((holiday) => {
            events.push({
                id: holiday.id,
                name: holiday.title,
                date: holiday.summary,
                tone: 'holiday',
                highlighted: false,
            });
        });
    }

    return events.slice(0, 5);
}

function getCalendarData(activeFilter) {
    if (calendarDataCache.has(activeFilter)) {
        return calendarDataCache.get(activeFilter);
    }

    const eventMap = buildEventMap(activeFilter);
    const holidayMap = buildHolidayMap(activeFilter);
    const visibleEvents = eventRecords.filter((event) => activeFilter === 'all' || activeFilter === event.type);
    const value = {
        eventMap,
        fallbackUpcomingItems: buildFallbackUpcomingItems(activeFilter),
        holidayMap,
        visibleEvents,
    };

    calendarDataCache.set(activeFilter, value);
    return value;
}

export function buildMonthCells(monthDate, selectedDateKey, activeFilter) {
    const firstDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const gridStart = addDays(firstDayOfMonth, -firstDayOfMonth.getDay());
    const { eventMap, holidayMap } = getCalendarData(activeFilter);

    return Array.from({ length: 42 }, (_, index) => {
        const currentDate = addDays(gridStart, index);
        const dateKey = formatDateKey(currentDate);
        const holiday = holidayMap[dateKey];

        return {
            date: currentDate,
            dateKey,
            day: currentDate.getDate(),
            muted: !sameMonth(currentDate, monthDate),
            highlighted: dateKey === selectedDateKey,
            events: eventMap[dateKey] ?? [],
            holiday: holiday ? holiday.title : null,
        };
    });
}

export function buildUpcomingItems(activeFilter, selectedDateKey) {
    const { eventMap, fallbackUpcomingItems, holidayMap } = getCalendarData(activeFilter);
    const selectedEvents = (eventMap[selectedDateKey] ?? []).map((event) => ({
        id: event.id,
        name: event.title,
        date: event.summary,
        tone: event.type,
        highlighted: false,
    }));

    const selectedHoliday = holidayMap[selectedDateKey];

    if (selectedHoliday) {
        selectedEvents.push({
            id: selectedHoliday.id,
            name: selectedHoliday.title,
            date: selectedHoliday.summary,
            tone: 'holiday',
            highlighted: false,
        });
    }

    if (selectedEvents.length) {
        return selectedEvents;
    }

    return fallbackUpcomingItems;
}

function getEventDateRange(event) {
    const sortedDates = [...event.dates].sort();

    return {
        startDateKey: sortedDates[0],
        endDateKey: sortedDates[sortedDates.length - 1],
    };
}

function getConsultantNameFromTitle(title) {
    const [name] = String(title || '').split(' - ');
    return name || 'Unknown Consultant';
}

function getConsultantShortName(name) {
    const parts = String(name || '')
        .split(' ')
        .filter(Boolean);

    if (parts.length >= 2) {
        return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
    }

    const compactName = String(name || '').replace(/[^A-Za-z0-9]/g, '');
    return compactName.slice(0, 2).toUpperCase() || 'NA';
}

function getLeaveLabelFromTitle(title) {
    const [, leaveLabel] = String(title || '').split(' - ');
    return leaveLabel || 'Out of Office';
}

function getConsultantCode(label, fallbackIndex) {
    const compactLabel = String(label || '')
        .replace(/[^A-Za-z0-9]/g, '')
        .toUpperCase();

    return compactLabel || `CONS${fallbackIndex + 1}`;
}

function getEventLeaveCode(event, fallbackIndex) {
    const explicitCode = String(event?.leaveCode || event?.requestCode || event?.code || '')
        .trim()
        .toUpperCase();

    if (explicitCode) {
        return explicitCode;
    }

    return `${getConsultantCode(event?.shortLabel, fallbackIndex).slice(0, 3)}${String(fallbackIndex + 1).padStart(3, '0')}`;
}

function getLeaveToneKey(title) {
    const source = String(title || '').toLowerCase();

    if (source.includes('sick')) {
        return 'sick';
    }

    if (source.includes('business')) {
        return 'business';
    }

    if (source.includes('remote')) {
        return 'remote';
    }

    return 'annual';
}

function getTimelineRequestStatus(type) {
    if (type === 'pending') {
        return { statusTone: 'pending', statusLabel: 'Pending' };
    }

    return { statusTone: 'approved', statusLabel: 'Approved' };
}

function buildTimelineRequest(event, consultantName, consultantCode, eventIndex, startDateKey, endDateKey) {
    const leaveCode = getEventLeaveCode(event, eventIndex);
    const leaveLabel = getLeaveLabelFromTitle(event.title);
    const { statusTone, statusLabel } = getTimelineRequestStatus(event.type);

    return {
        id: event.id,
        avatarLabel: consultantCode.slice(0, 2) || 'OO',
        name: consultantName,
        role: 'Consultant',
        leaveLabel,
        leaveToneKey: getLeaveToneKey(event.title),
        dateRange: formatDateRange(startDateKey, endDateKey),
        duration: getDurationLabel(startDateKey, endDateKey),
        durationLabel: getDurationLabel(startDateKey, endDateKey),
        submittedAt: event.summary || 'Recently submitted',
        reason: leaveLabel,
        reviewComment: statusTone === 'approved' ? 'Approved leave request.' : 'Pending leave request.',
        employeeId: leaveCode,
        statusTone,
        statusLabel,
        reviewerName: statusTone === 'approved' ? 'Approval Team' : '',
        raw: {
            id: event.id,
            start_date: startDateKey,
            end_date: endDateKey,
            review: statusTone === 'approved' ? { reviewer: { name: 'Approval Team' } } : undefined,
        },
    };
}

export function buildTimelineRows(monthDate, activeFilter) {
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    const { visibleEvents } = getCalendarData(activeFilter);
    const rowMap = new Map();

    visibleEvents.forEach((event, eventIndex) => {
        const { startDateKey, endDateKey } = getEventDateRange(event);
        const eventStart = parseDateKey(startDateKey);
        const eventEnd = parseDateKey(endDateKey);

        if (eventEnd < monthStart || eventStart > monthEnd) {
            return;
        }

        const consultantName = getConsultantNameFromTitle(event.title);
        const consultantCode = getConsultantCode(event.shortLabel, eventIndex);

        if (!rowMap.has(consultantName)) {
            rowMap.set(consultantName, {
                id: consultantName,
                name: consultantName,
                shortName: getConsultantShortName(consultantName),
                code: consultantCode,
                events: [],
            });
        }

        rowMap.get(consultantName).events.push({
            id: event.id,
            label: getEventLeaveCode(event, eventIndex),
            startDateKey,
            endDateKey,
            tone: event.displayTone ?? event.type,
            title: event.title,
            request: buildTimelineRequest(event, consultantName, consultantCode, eventIndex, startDateKey, endDateKey),
        });
    });

    return [...rowMap.values()].sort((left, right) => left.name.localeCompare(right.name));
}

export function buildTimelineLayout(monthDate, activeFilter, dayWidth = DAY_WIDTH) {
    const cacheKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}-${activeFilter}-${dayWidth}`;

    if (timelineLayoutCache.has(cacheKey)) {
        return timelineLayoutCache.get(cacheKey);
    }

    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, index) => new Date(monthDate.getFullYear(), monthDate.getMonth(), index + 1));
    const rows = buildTimelineRows(monthDate, activeFilter).map((row) => ({
        ...row,
        positionedEvents: row.events.map((item) => {
            const startDate = parseDateKey(item.startDateKey);
            const endDate = parseDateKey(item.endDateKey);
            const visibleStart = startDate < days[0] ? days[0] : startDate;
            const visibleEnd = endDate > days[days.length - 1] ? days[days.length - 1] : endDate;
            const startOffset = visibleStart.getDate() - 1;
            const spanDays = visibleEnd.getDate() - visibleStart.getDate() + 1;

            return {
                ...item,
                left: startOffset * dayWidth,
                width: Math.max(spanDays * dayWidth - 6, 50),
            };
        }),
    }));

    const value = {
        days,
        rows,
        trackWidth: days.length * dayWidth,
    };

    timelineLayoutCache.set(cacheKey, value);
    return value;
}
