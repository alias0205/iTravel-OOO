export const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const legendItems = [
    { key: 'self', label: 'Your Leave', color: '#0A6B63' },
    { key: 'team', label: 'Consuldant Leave', color: '#4B7BE8' },
    { key: 'pending', label: 'Pending', color: '#F97316' },
    { key: 'holiday', label: 'Public Holiday', color: '#A855F7' },
];

export const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'self', label: 'Your Leave' },
    { key: 'team', label: 'Consuldant Leave' },
    { key: 'pending', label: 'Pending' },
    { key: 'holiday', label: 'Holiday' },
];

const eventRecords = [
    {
        id: 'john-vacation',
        shortLabel: 'John S.',
        title: 'John Smith - Vacation',
        summary: 'Dec 5-6, 2024',
        type: 'team',
        dates: ['2024-12-05', '2024-12-06'],
    },
    {
        id: 'maria-personal',
        shortLabel: 'Maria G.',
        title: 'Maria Garcia - Personal Day',
        summary: 'Dec 13, 2024',
        type: 'team',
        dates: ['2024-12-13'],
    },
    {
        id: 'you-vacation',
        shortLabel: 'You',
        title: 'You - Vacation',
        summary: 'Dec 18-20, 2024',
        type: 'self',
        dates: ['2024-12-18', '2024-12-19', '2024-12-20'],
    },
    {
        id: 'tom-sick',
        shortLabel: 'Tom R.',
        title: 'Tom Roberts - Sick Leave',
        summary: 'Dec 18-19, 2024',
        type: 'team',
        displayTone: 'selfSecondary',
        dates: ['2024-12-18', '2024-12-19'],
    },
    {
        id: 'coverage-pending',
        shortLabel: 'Pending',
        title: 'Coverage Approval Pending',
        summary: 'Dec 23-24, 2024',
        type: 'pending',
        dates: ['2024-12-23', '2024-12-24'],
    },
    {
        id: 'julia-leave',
        shortLabel: 'Julia K.',
        title: 'Julia Kim - Annual Leave',
        summary: 'Jan 7-8, 2025',
        type: 'team',
        dates: ['2025-01-07', '2025-01-08'],
    },
    {
        id: 'you-training',
        shortLabel: 'You',
        title: 'You - Remote Planning',
        summary: 'Jan 14, 2025',
        type: 'self',
        dates: ['2025-01-14'],
    },
];

const holidayRecords = [
    { id: 'christmas', date: '2024-12-25', title: 'Christmas Day', summary: 'Dec 25, 2024' },
    { id: 'boxing-day', date: '2024-12-26', title: 'Boxing Day', summary: 'Dec 26, 2024' },
    { id: 'new-year', date: '2025-01-01', title: "New Year's Day", summary: 'Jan 1, 2025' },
];

export const availableYears = [2024, 2025, 2026];
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

export function buildMonthCells(monthDate, selectedDateKey, activeFilter) {
    const firstDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const gridStart = addDays(firstDayOfMonth, -firstDayOfMonth.getDay());
    const eventMap = buildEventMap(activeFilter);
    const holidayMap = buildHolidayMap(activeFilter);

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
    const selectedEvents = (buildEventMap(activeFilter)[selectedDateKey] ?? []).map((event) => ({
        id: event.id,
        name: event.title,
        date: event.summary,
        tone: event.type,
        highlighted: event.type === 'self',
    }));

    const selectedHoliday = buildHolidayMap(activeFilter)[selectedDateKey];

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

    const events = eventRecords
        .filter((event) => activeFilter === 'all' || activeFilter === event.type)
        .map((event) => ({
            id: event.id,
            name: event.title,
            date: event.summary,
            tone: event.type,
            highlighted: event.type === 'self',
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
