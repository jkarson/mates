import { Month, ObjectWithId, TenantId, Weekday } from '../Common/types';
import { months, weekdays } from './constants';
import { Tenant, User } from './models';

function assertUnreachable(x: never): never {
    throw new Error("Didn't expect to get here");
}

/* This is obviously a simplistic getNewId... it won't work,
for instance, if object deletion is allowed. Of course, ID assignment
should be coming from the back-end. Determining what and where those endpoints 
are is something you're struggling with right now. I think a good thing to remember is 
to embrace the struggle. The struggle is the process of you getting smarter and your
code getting better. The time crunch is imaginary. Do your work and do it with art */
function getNewId<T extends ObjectWithId>(objects: T[]): string {
    if (objects.length === 0) {
        return '1';
    }
    const maxId = Math.max(...objects.map((object) => parseInt(object.id, 10)));
    const newId = maxId + 1;
    return newId.toString();
}

function getNewIds<T extends ObjectWithId>(objects: T[], quantity: number): string[] {
    const newId = getNewId(objects);
    const newIds: string[] = [];

    let ID = parseInt(newId, 10);
    for (quantity; quantity > 0; quantity--) {
        newIds.push(ID.toString());
        ID += 1;
    }
    return newIds;
}

function isLetter(c: string): boolean {
    return c.length === 1 && c.toLocaleLowerCase() !== c.toLocaleUpperCase();
}

function getTenant(user: User): Tenant {
    return user.apartment.tenants.find((tenant) => tenant.id === user.tenantId) as Tenant;
}

function getTenantByTenantId(user: User, tenantId: TenantId): Tenant | undefined {
    return user.apartment.tenants.find((tenant) => tenant.id === tenantId);
}

function convertDaysToMS(days: number) {
    return days * convertHoursToMS(24);
}

function convertHoursToMS(hours: number) {
    return hours * 3600000;
}

function getMonthByIndex(monthIndex: number) {
    return months[monthIndex];
}

function getMonthIndexByMonth(month: Month) {
    return months.indexOf(month);
}

function getDaysInMonth(month: Month, year: number) {
    switch (month) {
        case 'January':
            return 31;
        case 'February':
            return year % 4 === 0 ? 29 : 28;
        case 'March':
            return 31;
        case 'April':
            return 30;
        case 'May':
            return 31;
        case 'June':
            return 30;
        case 'July':
            return 31;
        case 'August':
            return 31;
        case 'September':
            return 30;
        case 'October':
            return 31;
        case 'November':
            return 30;
        case 'December':
            return 31;
        default:
            assertUnreachable(month);
    }
}

function getFormattedDateTimeString(date: Date) {
    return date.toLocaleTimeString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getFormattedDateString(date: Date) {
    return date.toLocaleDateString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        weekday: 'long',
    });
}

function isSameDayMonthYear(dateOne: Date, dateTwo: Date) {
    return (
        dateOne.getFullYear() === dateTwo.getFullYear() &&
        dateOne.getMonth() === dateTwo.getMonth() &&
        dateOne.getDate() === dateTwo.getDate()
    );
}

function isPreviousDate(dateOne: Date, dateTwo: Date) {
    return dateOne.getTime() < dateTwo.getTime() && !isSameDayMonthYear(dateOne, dateTwo);
}

function isFutureDate(dateOne: Date, dateTwo: Date) {
    return dateOne.getTime() > dateTwo.getTime() && !isSameDayMonthYear(dateOne, dateTwo);
}

function getTodaysDate() {
    return new Date(Date.now());
}

function getYesterdaysDate() {
    const yesterday = new Date(Date.now());
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

function getYesterdaysDateFromDate(date: Date) {
    const yesterday = new Date(date.getTime());
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

function getDayFromDayIndex(dayIndex: number): Weekday {
    return weekdays[dayIndex];
}

function getNextMonthDayIndicesMonthly(currentDate: Date): [number, number] {
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth + 1;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const daysInNextMonth = getDaysInMonth(getMonthByIndex(nextMonth % 12), nextYear);
    if (currentDay < daysInNextMonth) {
        return [nextMonth, currentDay];
    } else {
        return [nextMonth, daysInNextMonth];
    }
}

function getNextMonthDayIndicesBiMonthly(currentDate: Date): [number, number] {
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth + 2;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const daysInNextMonth = getDaysInMonth(getMonthByIndex(nextMonth % 12), nextYear);
    if (currentDay < daysInNextMonth) {
        return [nextMonth, currentDay];
    } else {
        return [nextMonth, daysInNextMonth];
    }
}

function getNextMonthDayIndicesQuarterly(currentDate: Date): [number, number] {
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth + 3;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const daysInNextMonth = getDaysInMonth(getMonthByIndex(nextMonth % 12), nextYear);
    if (currentDay < daysInNextMonth) {
        return [nextMonth, currentDay];
    } else {
        return [nextMonth, daysInNextMonth];
    }
}

function getNextMonthDayIndicesTriAnnually(currentDate: Date): [number, number] {
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth + 4;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const daysInNextMonth = getDaysInMonth(getMonthByIndex(nextMonth % 12), nextYear);
    if (currentDay < daysInNextMonth) {
        return [nextMonth, currentDay];
    } else {
        return [nextMonth, daysInNextMonth];
    }
}

function getNextMonthDayIndicesBiAnnually(currentDate: Date): [number, number] {
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth + 6;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const daysInNextMonth = getDaysInMonth(getMonthByIndex(nextMonth % 12), nextYear);
    if (currentDay < daysInNextMonth) {
        return [nextMonth, currentDay];
    } else {
        return [nextMonth, daysInNextMonth];
    }
}

function divideMoneyTotal(amount: number, splitNumber: number): number[] {
    const pennies = Math.round(amount * 100);
    const baseAmount = Math.floor(pennies / splitNumber);
    const leftOver = Math.round(pennies % splitNumber);

    const pennyValues: number[] = [];
    let i: number;
    for (i = 0; i < splitNumber; i++) {
        const amount = i < leftOver ? baseAmount + 1 : baseAmount;
        pennyValues.push(amount);
    }
    const dollarValues = pennyValues.map((pennyValue) => pennyValue / 100);
    return dollarValues;
}

function getPercent(amount: number, total: number): number {
    return total !== 0 ? (amount / total) * 100 : 0;
}

function getAmountFromPercent(percent: number, total: number): number {
    return (total * percent) / 100;
}

function roundToTenth(num: number) {
    return Math.round(num * 10) / 10;
}

function roundToHundredth(num: number) {
    return Math.round(num * 100) / 100;
}

const handleFocusNumericInput = (input: React.RefObject<HTMLInputElement>) => {
    if (input.current && input.current.value === '0') {
        input.current.value = '';
    }
    return;
};

const handleBlurNumericInput = (input: React.RefObject<HTMLInputElement>) => {
    if (input.current && input.current.value === '') {
        input.current.value = '0';
    }
    return;
};

const isNotEmpty = (str: string) => {
    return
}

export {
    assertUnreachable,
    getNewId,
    getNewIds,
    isLetter,
    getTenant,
    getTenantByTenantId,
    convertDaysToMS,
    convertHoursToMS,
    getDaysInMonth,
    getMonthByIndex,
    getMonthIndexByMonth,
    getFormattedDateTimeString,
    getFormattedDateString,
    isSameDayMonthYear,
    isPreviousDate,
    isFutureDate,
    getTodaysDate,
    getYesterdaysDate,
    getYesterdaysDateFromDate,
    getDayFromDayIndex,
    getNextMonthDayIndicesMonthly,
    getNextMonthDayIndicesBiMonthly,
    getNextMonthDayIndicesQuarterly,
    getNextMonthDayIndicesTriAnnually,
    getNextMonthDayIndicesBiAnnually,
    divideMoneyTotal,
    getPercent,
    getAmountFromPercent,
    roundToTenth,
    roundToHundredth,
    handleBlurNumericInput,
    handleFocusNumericInput,
};
