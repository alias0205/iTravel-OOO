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

const defaultBankHolidayDates = new Set([
    '2024-12-25',
    '2024-12-26',
    '2025-01-01',
    '2025-04-18',
    '2025-04-21',
    '2025-05-05',
    '2025-05-26',
    '2025-08-25',
    '2025-12-25',
    '2025-12-26',
    '2026-01-01',
    '2026-04-03',
    '2026-04-06',
]);

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseDateRange(dateRange) {
    const match = /^([A-Za-z]{3})\s+(\d{1,2})\s+-\s+([A-Za-z]{3})\s+(\d{1,2}),\s+(\d{4})$/.exec(dateRange ?? '');

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

export function getApprovalDurationBreakdown(request) {
    const parsedRange = parseDateRange(request?.dateRange);

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
        label: `${totalDays}/${weekendDays}/${bankHolidayDays} days \n (total/weekend/bank holiday)`,
    };
}
