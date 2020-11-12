import { Month, ObjectWithId, TenantId } from '../Common/types';
import { months } from './constants';
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
    const maxId = Math.max(...objects.map((object) => parseInt(object.id, 10)));
    const newId = maxId + 1;
    return newId.toString();
}

function getNewIds<T extends ObjectWithId>(objects: T[], quantity: number): string[] {
    const newId = getNewId(objects);
    const newIds: string[] = [];

    let ID = newId;
    for (quantity; quantity > 0; quantity--) {
        newIds.push(ID);
        ID += 1;
    }
    return newIds;
}

function isLetter(c: string): boolean {
    return c.length === 1 && c.toLocaleLowerCase() !== c.toLocaleUpperCase();
}

// Given a user and an optional tenantId, returns the tenant
// in the user's apartment with the given tenantId, or the tenant
// corresponding to the user themself if none is given.
function getTenant(user: User, tenantId?: TenantId): Tenant | undefined {
    if (tenantId) {
        return user.apartment.tenants.find((tenant) => tenant.id === tenantId);
    } else {
        return user.apartment.tenants.find((tenant) => tenant.id === user.tenantId);
    }
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

function getYesterdaysDate() {
    const yesterday = new Date(Date.now());
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

export {
    assertUnreachable,
    getNewId,
    getNewIds,
    isLetter,
    getTenant,
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
    getYesterdaysDate,
};
