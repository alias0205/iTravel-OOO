export const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const legendItems = [
    { key: 'approved', label: 'Approved Request', color: '#4B7BE8' },
    { key: 'holiday', label: 'Public Holiday', color: '#A855F7' },
];

const DAY_WIDTH = 56;
const TIMELINE_BAR_HEIGHT = 28;
const TIMELINE_ROW_MIN_HEIGHT = 58;
const TIMELINE_ROW_PADDING = 8;
const TIMELINE_ROW_GAP = 6;
const currentDate = new Date();

export const initialMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
export const initialSelectedDate = formatDateKey(currentDate);

export function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey) {
    const [year, month, day] = String(dateKey || '').split('-').map(Number);
    return new Date(year, (month || 1) - 1, day || 1);
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

function normalizeDate(dateValue) {
    if (!dateValue) {
        return null;
    }

    const parsedDate = dateValue instanceof Date ? new Date(dateValue) : new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
}

function formatShortDate(dateValue) {
    const parsedDate = normalizeDate(dateValue);

    if (!parsedDate) {
        return 'Date unavailable';
    }

    return parsedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function slugify(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function buildShortLabel(fullName) {
    const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
        return `${parts[0]} ${parts[1][0]}.`;
    }

    return parts[0] || 'Consultant';
}

function buildInitials(fullName) {
    const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
        return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
    }

    return (parts[0] || 'NA').slice(0, 2).toUpperCase();
}

function buildDateKeysBetween(startDateValue, endDateValue) {
    const startDate = normalizeDate(startDateValue);
    const endDate = normalizeDate(endDateValue);

    if (!startDate || !endDate || startDate > endDate) {
        return [];
    }

    const dateKeys = [];
    const cursor = new Date(startDate);

    while (cursor <= endDate) {
        dateKeys.push(formatDateKey(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }

    return dateKeys;
}

function ensureArray(value) {
    return Array.isArray(value) ? value : [];
}

function buildApprovedEventRecords(approvedRequests = []) {
    return ensureArray(approvedRequests)
        .filter((request) => request?.statusTone === 'approved')
        .map((request) => {
            const fullName = request?.name || request?.raw?.user?.name || 'Unknown Consultant';
            const leaveLabel = request?.leaveLabel || 'Out of Office';
            const startDate = request?.raw?.start_date || request?.start_date;
            const endDate = request?.raw?.end_date || request?.end_date;

            return {
                dates: buildDateKeysBetween(startDate, endDate),
                id: String(request?.id || `${fullName}-${startDate || 'request'}`),
                name: fullName,
                request,
                shortLabel: buildShortLabel(fullName),
                summary: request?.dateRange || formatDateRange(startDate, endDate),
                title: `${fullName} - ${leaveLabel}`,
                tone: 'approved',
            };
        })
        .filter((event) => event.dates.length > 0);
}

function getEasterSunday(year) {
    const century = Math.floor(year / 100);
    const yearInCentury = year % 100;
    const leapCentury = Math.floor(century / 4);
    const centuryRemainder = century % 4;
    const correction = Math.floor((century + 8) / 25);
    const adjustedCorrection = Math.floor((century - correction + 1) / 3);
    const goldenNumber = (19 * (year % 19) + century - leapCentury - adjustedCorrection + 15) % 30;
    const leapYearsInCentury = Math.floor(yearInCentury / 4);
    const yearRemainder = yearInCentury % 4;
    const weekdayOffset = (32 + 2 * centuryRemainder + 2 * leapYearsInCentury - goldenNumber - yearRemainder) % 7;
    const monthOffset = Math.floor(((year % 19) + 11 * goldenNumber + 22 * weekdayOffset) / 451);
    const month = Math.floor((goldenNumber + weekdayOffset - 7 * monthOffset + 114) / 31);
    const day = ((goldenNumber + weekdayOffset - 7 * monthOffset + 114) % 31) + 1;

    return new Date(year, month - 1, day);
}

function getFirstMondayOfMonth(year, monthIndex) {
    const date = new Date(year, monthIndex, 1);

    while (date.getDay() !== 1) {
        date.setDate(date.getDate() + 1);
    }

    return date;
}

function getLastMondayOfMonth(year, monthIndex) {
    const date = new Date(year, monthIndex + 1, 0);

    while (date.getDay() !== 1) {
        date.setDate(date.getDate() - 1);
    }

    return date;
}

function addHolidayRecord(records, date, title) {
    const dateKey = formatDateKey(date);

    records.push({
        date: dateKey,
        id: `${dateKey}-${slugify(title)}`,
        summary: formatShortDate(date),
        title,
    });
}

function addObservedHolidayRecord(records, usedDateKeys, date, title) {
    const observedDate = new Date(date);

    while (observedDate.getDay() === 0 || observedDate.getDay() === 6 || usedDateKeys.has(formatDateKey(observedDate))) {
        observedDate.setDate(observedDate.getDate() + 1);
    }

    const dateKey = formatDateKey(observedDate);
    usedDateKeys.add(dateKey);
    addHolidayRecord(records, observedDate, title);
}

export function buildPublicHolidayRecords(startYear, endYear) {
    const currentYearValue = new Date().getFullYear();
    const firstYear = Number.isFinite(startYear) ? startYear : currentYearValue - 1;
    const lastYear = Number.isFinite(endYear) ? endYear : currentYearValue + 2;
    const holidayRecords = [];

    for (let year = firstYear; year <= lastYear; year += 1) {
        const usedObservedDates = new Set();
        const easterSunday = getEasterSunday(year);

        addObservedHolidayRecord(holidayRecords, usedObservedDates, new Date(year, 0, 1), "New Year's Day");
        addHolidayRecord(holidayRecords, addDays(easterSunday, -2), 'Good Friday');
        addHolidayRecord(holidayRecords, addDays(easterSunday, 1), 'Easter Monday');
        addHolidayRecord(holidayRecords, getFirstMondayOfMonth(year, 4), 'Early May Bank Holiday');
        addHolidayRecord(holidayRecords, getLastMondayOfMonth(year, 4), 'Spring Bank Holiday');
        addHolidayRecord(holidayRecords, getLastMondayOfMonth(year, 7), 'Summer Bank Holiday');
        addObservedHolidayRecord(holidayRecords, usedObservedDates, new Date(year, 11, 25), 'Christmas Day');
        addObservedHolidayRecord(holidayRecords, usedObservedDates, new Date(year, 11, 26), 'Boxing Day');
    }

    return holidayRecords;
}

export function buildAvailableYears(approvedRequests = []) {
    const currentYearValue = new Date().getFullYear();
    const years = new Set([currentYearValue - 1, currentYearValue, currentYearValue + 1, currentYearValue + 2]);

    ensureArray(approvedRequests).forEach((request) => {
        const startDate = normalizeDate(request?.raw?.start_date || request?.start_date);
        const endDate = normalizeDate(request?.raw?.end_date || request?.end_date);

        if (startDate) {
            years.add(startDate.getFullYear());
        }

        if (endDate) {
            years.add(endDate.getFullYear());
        }
    });

    const sortedYears = [...years].sort((left, right) => left - right);
    const minYear = sortedYears[0] ?? currentYearValue;
    const maxYear = sortedYears[sortedYears.length - 1] ?? currentYearValue;

    return Array.from({ length: maxYear - minYear + 1 }, (_, index) => minYear + index);
}

function buildEventMap(approvedRequests) {
    const eventMap = {};

    buildApprovedEventRecords(approvedRequests).forEach((event) => {
        event.dates.forEach((dateKey) => {
            if (!eventMap[dateKey]) {
                eventMap[dateKey] = [];
            }

            eventMap[dateKey].push({
                id: `${event.id}-${dateKey}`,
                label: event.shortLabel,
                request: event.request,
                summary: event.summary,
                title: event.title,
                tone: event.tone,
            });
        });
    });

    return eventMap;
}

function buildHolidayMap(publicHolidayRecords = []) {
    return ensureArray(publicHolidayRecords).reduce((accumulator, holiday) => {
        accumulator[holiday.date] = holiday;
        return accumulator;
    }, {});
}

function buildFallbackUpcomingItems(approvedRequests, publicHolidayRecords, selectedDateKey) {
    const referenceDateKey = selectedDateKey || initialSelectedDate;
    const requestItems = buildApprovedEventRecords(approvedRequests)
        .filter((event) => event.dates[event.dates.length - 1] >= referenceDateKey)
        .map((event) => ({
            date: event.summary,
            dateKey: event.dates[0],
            highlighted: false,
            id: event.id,
            name: event.title,
            request: event.request,
            tone: 'approved',
        }));

    const holidayItems = ensureArray(publicHolidayRecords)
        .filter((holiday) => holiday.date >= referenceDateKey)
        .map((holiday) => ({
            date: holiday.summary,
            dateKey: holiday.date,
            highlighted: false,
            id: holiday.id,
            name: holiday.title,
            tone: 'holiday',
        }));

    return [...requestItems, ...holidayItems]
        .sort((left, right) => left.dateKey.localeCompare(right.dateKey))
        .slice(0, 5);
}

export function buildMonthCells(monthDate, selectedDateKey, approvedRequests, publicHolidayRecords) {
    const firstDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const gridStart = addDays(firstDayOfMonth, -firstDayOfMonth.getDay());
    const eventMap = buildEventMap(approvedRequests);
    const holidayMap = buildHolidayMap(publicHolidayRecords);

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

export function buildUpcomingItems(selectedMonth, approvedRequests, publicHolidayRecords) {
    const eventMap = buildEventMap(approvedRequests);
    const holidayMap = buildHolidayMap(publicHolidayRecords);
    const todayDateKey = formatDateKey(new Date());
    const monthStartDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const monthEndDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    const monthStartKey = formatDateKey(monthStartDate);
    const monthEndKey = formatDateKey(monthEndDate);
    const requestItems = Object.entries(eventMap)
        .filter(([dateKey]) => dateKey >= todayDateKey && dateKey >= monthStartKey && dateKey <= monthEndKey)
        .flatMap(([dateKey, events]) =>
            events.map((event) => ({
                id: `${event.id}-${dateKey}`,
                name: event.title,
                date: event.summary,
                dateKey,
                request: event.request,
                tone: event.tone,
                highlighted: false,
            }))
        );

    const holidayItems = Object.entries(holidayMap)
        .filter(([dateKey]) => dateKey >= todayDateKey && dateKey >= monthStartKey && dateKey <= monthEndKey)
        .map(([dateKey, holiday]) => ({
            id: holiday.id,
            name: holiday.title,
            date: holiday.summary,
            dateKey,
            tone: 'holiday',
            highlighted: false,
        }));

    return [...requestItems, ...holidayItems]
        .sort((left, right) => left.dateKey.localeCompare(right.dateKey))
        .slice(0, 5);
}

function getEventDateRange(event) {
    const sortedDates = [...event.dates].sort((left, right) => left.localeCompare(right));

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

function getLeaveToneKey(title) {
    const source = String(title || '').toLowerCase();

    return 'annual';
}

function buildTimelineRequest(event, consultantName, consultantCode, startDateKey, endDateKey) {
    const leaveLabel = getLeaveLabelFromTitle(event.title);

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
        submittedAt: event.request?.submittedAt || event.summary || 'Recently submitted',
        reason: leaveLabel,
        reviewComment: event.request?.reviewComment || 'Approved leave request.',
        employeeId: event.request?.employeeId || consultantCode,
        statusTone: 'approved',
        statusLabel: 'Approved',
        reviewerName: event.request?.reviewerName || 'Approval Team',
        raw: event.request?.raw || {
            id: event.id,
            start_date: startDateKey,
            end_date: endDateKey,
        },
    };
}

export function buildTimelineRows(monthDate, approvedRequests) {
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    const visibleEvents = buildApprovedEventRecords(approvedRequests);
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
            label: event.request?.leaveLabel || getLeaveLabelFromTitle(event.title),
            startDateKey,
            endDateKey,
            tone: event.tone,
            title: event.title,
            request: buildTimelineRequest(event, consultantName, consultantCode, startDateKey, endDateKey),
        });
    });

    return [...rowMap.values()].sort((left, right) => left.name.localeCompare(right.name));
}

function buildPositionedTimelineEvents(rowEvents, days, dayWidth) {
    const laneEndDates = [];

    return [...rowEvents]
        .sort((left, right) => {
            if (left.startDateKey !== right.startDateKey) {
                return left.startDateKey.localeCompare(right.startDateKey);
            }

            return left.endDateKey.localeCompare(right.endDateKey);
        })
        .map((item) => {
            const startDate = parseDateKey(item.startDateKey);
            const endDate = parseDateKey(item.endDateKey);
            const visibleStart = startDate < days[0] ? days[0] : startDate;
            const visibleEnd = endDate > days[days.length - 1] ? days[days.length - 1] : endDate;
            const visibleStartKey = formatDateKey(visibleStart);
            const visibleEndKey = formatDateKey(visibleEnd);
            const startOffset = visibleStart.getDate() - 1;
            const spanDays = visibleEnd.getDate() - visibleStart.getDate() + 1;
            let laneIndex = laneEndDates.findIndex((laneEndDate) => visibleStartKey > laneEndDate);

            if (laneIndex < 0) {
                laneIndex = laneEndDates.length;
            }

            laneEndDates[laneIndex] = visibleEndKey;

            return {
                ...item,
                laneIndex,
                left: startOffset * dayWidth,
                top: TIMELINE_ROW_PADDING + laneIndex * (TIMELINE_BAR_HEIGHT + TIMELINE_ROW_GAP),
                width: Math.max(spanDays * dayWidth - 6, 50),
            };
        });
}

function buildTimelineRowLayout(row, days, dayWidth) {
    const positionedEvents = buildPositionedTimelineEvents(row.events, days, dayWidth);
    const laneCount = positionedEvents.reduce((maxLaneCount, item) => Math.max(maxLaneCount, item.laneIndex + 1), 0);
    const height = Math.max(
        TIMELINE_ROW_MIN_HEIGHT,
        TIMELINE_ROW_PADDING * 2 + laneCount * TIMELINE_BAR_HEIGHT + Math.max(laneCount - 1, 0) * TIMELINE_ROW_GAP
    );

    return {
        ...row,
        height,
        positionedEvents,
    };
}

export function buildTimelineLayout(monthDate, approvedRequests, dayWidth = DAY_WIDTH) {

    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, index) => new Date(monthDate.getFullYear(), monthDate.getMonth(), index + 1));
    const rows = buildTimelineRows(monthDate, approvedRequests).map((row) => buildTimelineRowLayout(row, days, dayWidth));

    return {
        days,
        rows,
        trackWidth: days.length * dayWidth,
    };
}
