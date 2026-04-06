const monthIndexMap = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
};

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function addDays(date, days) {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
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

function addObservedHoliday(holidaySet, date, usedDateKeys = new Set()) {
    const observedDate = new Date(date);

    while (observedDate.getDay() === 0 || observedDate.getDay() === 6 || usedDateKeys.has(formatDateKey(observedDate))) {
        observedDate.setDate(observedDate.getDate() + 1);
    }

    const dateKey = formatDateKey(observedDate);
    usedDateKeys.add(dateKey);
    holidaySet.add(dateKey);
}

function buildYearBankHolidayDates(year) {
    const holidaySet = new Set();
    const usedObservedDates = new Set();
    const easterSunday = getEasterSunday(year);

    addObservedHoliday(holidaySet, new Date(year, 0, 1), usedObservedDates);
    holidaySet.add(formatDateKey(addDays(easterSunday, -2)));
    holidaySet.add(formatDateKey(addDays(easterSunday, 1)));
    holidaySet.add(formatDateKey(getFirstMondayOfMonth(year, 4)));
    holidaySet.add(formatDateKey(getLastMondayOfMonth(year, 4)));
    holidaySet.add(formatDateKey(getLastMondayOfMonth(year, 7)));
    addObservedHoliday(holidaySet, new Date(year, 11, 25), usedObservedDates);
    addObservedHoliday(holidaySet, new Date(year, 11, 26), usedObservedDates);

    return holidaySet;
}

function buildDefaultBankHolidayDates(startYear = 2024, endYear = 2030) {
    const holidaySet = new Set();

    for (let year = startYear; year <= endYear; year += 1) {
        buildYearBankHolidayDates(year).forEach((dateKey) => holidaySet.add(dateKey));
    }

    return holidaySet;
}

const defaultBankHolidayDates = buildDefaultBankHolidayDates();

function normalizeDateValue(dateValue) {
    if (!dateValue) {
        return null;
    }

    const parsedDate = dateValue instanceof Date ? new Date(dateValue) : new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
}

function parseDateRange(dateRange) {
    const match = /^([A-Za-z]{3})\s+(\d{1,2})\s+-\s+([A-Za-z]{3})\s+(\d{1,2}),?\s+(\d{4})$/.exec((dateRange ?? '').trim());

    if (!match) {
        return null;
    }

    const [, startMonthLabel, startDayValue, endMonthLabel, endDayValue, yearValue] = match;
    const year = Number(yearValue);
    const startMonth = monthIndexMap[startMonthLabel.toLowerCase()];
    const endMonth = monthIndexMap[endMonthLabel.toLowerCase()];

    if (startMonth == null || endMonth == null) {
        return null;
    }

    return {
        startDate: new Date(year, startMonth, Number(startDayValue)),
        endDate: new Date(year, endMonth, Number(endDayValue)),
    };
}

function buildHolidaySet(bankHolidayDates) {
    if (!Array.isArray(bankHolidayDates) || !bankHolidayDates.length) {
        return defaultBankHolidayDates;
    }

    return new Set([...defaultBankHolidayDates, ...bankHolidayDates]);
}

function resolveRequestDateRange(request) {
    const directStartDate = normalizeDateValue(request?.raw?.start_date || request?.start_date || request?.startDate);
    const directEndDate = normalizeDateValue(request?.raw?.end_date || request?.end_date || request?.endDate);

    if (directStartDate && directEndDate) {
        return {
            startDate: directStartDate,
            endDate: directEndDate,
        };
    }

    return parseDateRange(request?.dateRange);
}

export function getApprovalDurationBreakdown(request) {
    const parsedRange = resolveRequestDateRange(request);

    if (!parsedRange) {
        return null;
    }

    const holidaySet = buildHolidaySet(request?.bankHolidayDates);
    const currentDate = new Date(parsedRange.startDate);
    let totalDays = 0;
    let weekendDays = 0;
    let bankHolidayDays = 0;

    while (currentDate <= parsedRange.endDate) {
        totalDays += 1;

        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekendDays += 1;
        }

        if (holidaySet.has(formatDateKey(currentDate))) {
            bankHolidayDays += 1;
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
        totalDays,
        weekendDays,
        bankHolidayDays,
        label: `${totalDays}/${weekendDays}/${bankHolidayDays} days\n(total/weekend/bank holiday)`,
    };
}
