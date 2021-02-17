import { ApartmentEvent } from '../pages/mates/Events/models/EventsInfo';
import { FriendProfile, ApartmentSummary } from '../pages/mates/Friends/models/FriendsInfo';
import {
    ServerFriendProfile,
    ServerApartmentSummary,
} from '../pages/mates/Friends/models/ServerFriendsInfo';
import { months, weekdays } from './constants';
import { Apartment, ClientClass, MatesUser, Tenant, UserId } from './models';
import { ServerClass } from './serverModels';
import { Month, Weekday, Frequency, TimeInputType, DateTimeInputType } from './types';

function assertUnreachable(x: never): never {
    throw new Error("Didn't expect to get here");
}

function isLetter(c: string): boolean {
    return c.length === 1 && c.toLocaleLowerCase() !== c.toLocaleUpperCase();
}

function isNumberMates(c: string): boolean {
    return (
        c === '0' ||
        c === '1' ||
        c === '2' ||
        c === '3' ||
        c === '4' ||
        c === '5' ||
        c === '6' ||
        c === '7' ||
        c === '8' ||
        c === '9'
    );
}

function getTenant(matesUser: MatesUser): Tenant {
    return matesUser.apartment.tenants.find(
        (tenant) => tenant.userId === matesUser.userId,
    ) as Tenant;
}

function getTenantByTenantId(matesUser: MatesUser, tenantId: UserId): Tenant | undefined {
    return matesUser.apartment.tenants.find((tenant) => tenant.userId === tenantId);
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

function getFormattedDateStringNoDay(date: Date) {
    return date.toLocaleDateString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
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

function getNextMonthDayIndicesMonthly(currentDate: Date, startingDate: Date): [number, number] {
    const currentMonth = currentDate.getMonth();
    const originalDay = startingDate.getDate();
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth + 1;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const daysInNextMonth = getDaysInMonth(getMonthByIndex(nextMonth % 12), nextYear);
    if (originalDay < daysInNextMonth) {
        return [nextMonth, originalDay];
    } else {
        return [nextMonth, daysInNextMonth];
    }
}

function getNextMonthDayIndicesBiMonthly(currentDate: Date, startingDate: Date): [number, number] {
    const currentMonth = currentDate.getMonth();
    const originalDay = startingDate.getDate();
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth + 2;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const daysInNextMonth = getDaysInMonth(getMonthByIndex(nextMonth % 12), nextYear);
    if (originalDay < daysInNextMonth) {
        return [nextMonth, originalDay];
    } else {
        return [nextMonth, daysInNextMonth];
    }
}

function getNextMonthDayIndicesQuarterly(currentDate: Date, startingDate: Date): [number, number] {
    const currentMonth = currentDate.getMonth();
    const originalDay = startingDate.getDate();
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth + 3;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const daysInNextMonth = getDaysInMonth(getMonthByIndex(nextMonth % 12), nextYear);
    if (originalDay < daysInNextMonth) {
        return [nextMonth, originalDay];
    } else {
        return [nextMonth, daysInNextMonth];
    }
}

function getNextMonthDayIndicesTriAnnually(
    currentDate: Date,
    startingDate: Date,
): [number, number] {
    const currentMonth = currentDate.getMonth();
    const originalDay = startingDate.getDate();
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth + 4;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const daysInNextMonth = getDaysInMonth(getMonthByIndex(nextMonth % 12), nextYear);
    if (originalDay < daysInNextMonth) {
        return [nextMonth, originalDay];
    } else {
        return [nextMonth, daysInNextMonth];
    }
}

function getNextMonthDayIndicesBiAnnually(currentDate: Date, startingDate: Date): [number, number] {
    const currentMonth = currentDate.getMonth();
    const originalDay = startingDate.getDate();
    const currentYear = currentDate.getFullYear();
    const nextMonth = currentMonth + 6;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const daysInNextMonth = getDaysInMonth(getMonthByIndex(nextMonth % 12), nextYear);
    if (originalDay < daysInNextMonth) {
        return [nextMonth, originalDay];
    } else {
        return [nextMonth, daysInNextMonth];
    }
}

function getMaxDate() {
    const current = getTodaysDate();
    const currYear = current.getFullYear();
    current.setFullYear(currYear + 1);
    current.setDate(current.getDate() + 1);
    return current;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getLaterDateToTest() {
    const maxDate = getMaxDate();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate;
}

function generateDates(starting: Date, generationStartDate: Date, frequency: Frequency): Date[] {
    const dates: Date[] = [];
    const ending = getMaxDate(); //getLaterDateToTest();

    let dateIterator = new Date(starting.getTime());
    loop1: while (isPreviousDate(dateIterator, ending)) {
        if (!isPreviousDate(dateIterator, generationStartDate)) {
            dates.push(new Date(dateIterator.getTime()));
        }
        switch (frequency) {
            case 'Daily':
                dateIterator.setDate(dateIterator.getDate() + 1);
                break;
            case 'Weekly':
                dateIterator.setDate(dateIterator.getDate() + 7);
                break;
            case 'Monthly':
                dateIterator.setMonth(...getNextMonthDayIndicesMonthly(dateIterator, starting));
                break;
            case 'Every 2 Months':
                dateIterator.setMonth(...getNextMonthDayIndicesBiMonthly(dateIterator, starting));
                break;
            case 'Every 3 Months':
                dateIterator.setMonth(...getNextMonthDayIndicesQuarterly(dateIterator, starting));
                break;
            case 'Quarterly':
                dateIterator.setMonth(...getNextMonthDayIndicesQuarterly(dateIterator, starting));
                break;
            case 'Every 4 Months':
                dateIterator.setMonth(...getNextMonthDayIndicesTriAnnually(dateIterator, starting));
                break;
            case 'Every 6 Months':
                dateIterator.setMonth(...getNextMonthDayIndicesBiAnnually(dateIterator, starting));
                break;
            case 'Yearly':
                dateIterator.setFullYear(dateIterator.getFullYear() + 1);
                break;
            case 'Once':
                break loop1;
            default:
                assertUnreachable(frequency);
        }
    }
    return dates;
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

function handleFocusNumericStringInput(
    input: React.RefObject<HTMLInputElement>,
    setAmount: (amount: string) => void,
) {
    if (input.current && (input.current.value === '0.00' || input.current.value === '0.0')) {
        setAmount('');
    }
    return;
}

function handleBlurNumericStringInput(
    input: React.RefObject<HTMLInputElement>,
    setAmount: (amount: string) => void,
    decimalPlaces: number,
) {
    if (input.current) {
        if (input.current.value === '') {
            let zeroString: string = '0.';
            let i: number = decimalPlaces;
            for (i; i > 0; i--) {
                zeroString += '0';
            }
            setAmount(zeroString);
        } else {
            const inputValue = roundToHundredth(parseFloat(input.current.value));
            setAmount(inputValue.toFixed(decimalPlaces));
        }
    }
    return;
}

function verifyAndSetNumericStringInput(
    event: React.ChangeEvent<HTMLInputElement>,
    setAmount: (amount: string) => void,
    decimalPlaces: number,
) {
    const input = event.target.value;
    if (input === '.') {
        setAmount(input);
        return;
    }
    if (!isNaN(input as any)) {
        if (input.length === 2 && input.charAt(0) === '0' && input.charAt(1) !== '.') {
            setAmount(input.charAt(1));
            return;
        }
        if (input.includes('.')) {
            const decimalPointIndex = input.indexOf('.');
            const decimalString = input.substring(decimalPointIndex + 1);
            if (decimalString.length <= decimalPlaces) {
                setAmount(input);
                return;
            }
        } else {
            setAmount(input);
            return;
        }
    }
}

function verifyAgeInput(ageInput: string) {
    const lastCharacter = ageInput.charAt(ageInput.length - 1);
    if (ageInput !== ageInput.trim()) {
        return false;
    }
    if (ageInput === '0') {
        return false;
    }
    if (lastCharacter === ' ' || lastCharacter === '-' || lastCharacter === '.') {
        return false;
    } else if (isNaN(ageInput as any)) {
        return false;
    } else {
        return true;
    }
}

function formatNames(names: string[]) {
    if (names.length === 0) {
        return '';
    } else if (names.length === 1) {
        return names[0];
    } else if (names.length === 2) {
        return names[0] + ' & ' + names[1];
    } else {
        return names[0] + ', ' + formatNames(names.slice(1));
    }
}

function getApartmentSummaryString(apartment: Apartment) {
    return (
        apartment.profile.name +
        ' (' +
        formatNames(apartment.tenants.map((tenant) => tenant.name)) +
        ')'
    );
}

function getFriendProfileSummaryString(friendProfile: FriendProfile) {
    return (
        friendProfile.name + ': ' + formatNames(friendProfile.tenants.map((tenant) => tenant.name))
    );
}

function getCurrentTime(): TimeInputType {
    const now = new Date(Date.now());
    const rawHour = now.getHours();
    const hour = rawHour % 12 === 0 ? 12 : rawHour % 12;
    const minute = now.getMinutes();
    const ampm = rawHour < 12 ? 'AM' : 'PM';
    return {
        hour: hour,
        minute: minute,
        ampm: ampm,
    };
}

function getCurrentDateTime(): DateTimeInputType {
    return {
        date: new Date(Date.now()),
        time: getCurrentTime(),
    };
}

function convertToDateWithTime(input: DateTimeInputType): Date {
    const convertToTime = (input: TimeInputType): [number, number] => {
        let hour: number;
        if (input.ampm === 'AM') {
            hour = input.hour === 12 ? 0 : input.hour;
        } else {
            hour = input.hour === 12 ? 12 : input.hour + 12;
        }
        const minute = input.minute;
        return [hour, minute];
    };
    const date = input.date;
    const time = convertToTime(input.time);
    date.setHours(...time);
    return date;
}

function getPostOptions(data: any) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
}

function getPutOptions(data: any) {
    return {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
}

function getDeleteOptions(data: any) {
    return {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
}

function initializeDates(uninitializedArray: ServerClass[], parameterName: string): ClientClass[] {
    const result: unknown = uninitializedArray.map((unintializedObject) => {
        unintializedObject[parameterName] = new Date(unintializedObject[parameterName]);
        return unintializedObject;
    });
    const clientResult = result as ClientClass[];
    return clientResult;
}

function getFriendProfilesFromServerFriendProfiles(
    friends: ServerFriendProfile[],
): FriendProfile[] {
    return friends.map((friend) => {
        return {
            apartmentId: friend._id,
            code: friend.profile.code,
            name: friend.profile.name,
            quote: friend.profile.quote,
            address: friend.profile.address,
            tenants: friend.tenants,
        };
    });
}

function getApartmentSummariesFromServerApartmentSummaries(
    apartmentSummaries: ServerApartmentSummary[],
): ApartmentSummary[] {
    return apartmentSummaries.map((summary) => {
        return {
            apartmentId: summary._id,
            name: summary.profile.name,
            tenantNames: summary.tenants.map((tenant) => tenant.name),
        };
    });
}

function getFriendProfileFromApartment(apartment: Apartment): FriendProfile {
    return {
        apartmentId: apartment._id,
        code: apartment.profile.code,
        name: apartment.profile.name,
        quote: apartment.profile.quote,
        address: apartment.profile.address,
        tenants: apartment.tenants,
    };
}

function getApartmentSummaryFromFriendProfile(friendProfile: FriendProfile): ApartmentSummary {
    return {
        apartmentId: friendProfile.apartmentId,
        name: friendProfile.name,
        tenantNames: friendProfile.tenants.map((tenant) => tenant.name),
    };
}

function formatPhoneNumber(s: string): string {
    if (s.length <= 3) {
        return s;
    }
    const firstThree = s.substring(0, 3);
    if (s.length <= 6) {
        return '(' + firstThree + ') ' + s.substring(3);
    }
    const nextThree = s.substring(3, 6);
    return '(' + firstThree + ') ' + nextThree + ' - ' + s.substring(6);
}

function countDigits(s: string): number {
    const chars = [...s];
    return chars.filter((c) => isNumberMates(c)).length;
}

function getDigits(s: string): string {
    const chars = [...s];
    const digits = chars.filter((c) => isNumberMates(c));
    return digits.join('');
}

function getTwoDigitDateString(d: Date): string {
    const month = d.getMonth();
    let monthString = '';
    switch (month) {
        case 0:
            monthString = '01';
            break;
        case 1:
            monthString = '02';
            break;
        case 2:
            monthString = '03';
            break;
        case 3:
            monthString = '04';
            break;
        case 4:
            monthString = '05';
            break;
        case 5:
            monthString = '06';
            break;
        case 6:
            monthString = '07';
            break;
        case 7:
            monthString = '08';
            break;
        case 8:
            monthString = '09';
            break;
        case 9:
            monthString = '10';
            break;
        case 10:
            monthString = '11';
            break;
        case 11:
            monthString = '12';
            break;
        default:
            assertUnreachable(month as never);
    }

    const dayOfMonth = d.getDate();
    let dayOfMonthString = '';
    if (dayOfMonth < 10) {
        dayOfMonthString = '0' + dayOfMonth;
    } else {
        dayOfMonthString = dayOfMonth + '';
    }

    const year = d.getFullYear();
    const yearShortened = year % 1000;
    return monthString + '/' + dayOfMonthString + '/' + yearShortened;
}

function getNullEvent(): ApartmentEvent {
    return {
        _id: '',
        creator: '',
        creatorId: '',
        hostApartmentId: '',
        time: new Date(Date.now()),
        invitees: [],
        attendees: [],
        title: '',
    };
}

export {
    assertUnreachable,
    isLetter,
    isNumberMates,
    getTenant,
    getTenantByTenantId,
    convertDaysToMS,
    convertHoursToMS,
    getDaysInMonth,
    getMonthByIndex,
    getMonthIndexByMonth,
    getFormattedDateTimeString,
    getFormattedDateString,
    getFormattedDateStringNoDay,
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
    getMaxDate,
    generateDates,
    divideMoneyTotal,
    getPercent,
    getAmountFromPercent,
    roundToTenth,
    roundToHundredth,
    handleBlurNumericStringInput,
    handleFocusNumericStringInput,
    verifyAndSetNumericStringInput,
    verifyAgeInput,
    formatNames,
    getApartmentSummaryString,
    getFriendProfileSummaryString,
    getCurrentTime,
    getCurrentDateTime,
    convertToDateWithTime,
    getPostOptions,
    getPutOptions,
    getDeleteOptions,
    initializeDates,
    getFriendProfilesFromServerFriendProfiles,
    getFriendProfileFromApartment,
    getApartmentSummaryFromFriendProfile,
    getApartmentSummariesFromServerApartmentSummaries,
    formatPhoneNumber,
    countDigits,
    getDigits,
    getTwoDigitDateString,
    getNullEvent,
    // getLaterDateToTest, //TEMP
};
