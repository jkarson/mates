import { TenantId } from '../../Common/types';
import {
    assertUnreachable,
    getDaysInMonth,
    getMonthByIndex,
    getNewIds,
    isPreviousDate,
} from '../../Common/utilities';
import { getMaxDate } from '../components/Chores';
import { ChoreGenerator, ChoreGeneratorID, Frequency } from './ChoreGenerator';

export interface Chore extends ChoreWithoutId {
    readonly id: ChoreID;
}

interface ChoreWithoutId {
    readonly choreGeneratorID: ChoreGeneratorID;
    name: string;
    assigneeIds: TenantId[];
    date: Date;
    completed: boolean;
    showUntilCompleted: boolean;
}

type ChoreID = string;

const getChoresFromChoreGenerator = (
    choreGenerator: ChoreGenerator,
    previousChores: Chore[],
    generationStartDate: Date,
): Chore[] => {
    const choresWithoutId = getChoresWithoutIdFromChoreGenerator(
        choreGenerator,
        generationStartDate,
    );
    const newIds = getNewIds(previousChores, choresWithoutId.length);
    const chores: Chore[] = [];
    choresWithoutId.forEach((chore, index) => chores.push({ ...chore, id: newIds[index] }));
    return chores;
};

const getChoresWithoutIdFromChoreGenerator = (
    { id, name, assigneeIds, showUntilCompleted, frequency, starting }: ChoreGenerator,
    generationStartDate: Date,
): ChoreWithoutId[] => {
    const choreDates = getDates(starting, generationStartDate, frequency);
    return choreDates.map((date) => {
        return {
            choreGeneratorID: id,
            name: name,
            assigneeIds: assigneeIds,
            showUntilCompleted: showUntilCompleted,
            completed: false,
            date: date,
        };
    });
};

const getDates = (starting: Date, generationStartDate: Date, frequency: Frequency): Date[] => {
    const dates: Date[] = [];

    let dateIterator = starting;
    const maxDate = getMaxDate();
    loop1: while (isPreviousDate(dateIterator, maxDate)) {
        if (!isPreviousDate(dateIterator, generationStartDate)) {
            dates.push(new Date(dateIterator));
        }
        switch (frequency) {
            case 'Daily':
                dateIterator.setDate(dateIterator.getDate() + 1);
                break;
            case 'Weekly':
                dateIterator.setDate(dateIterator.getDate() + 7);
                break;
            case 'Monthly':
                dateIterator.setMonth(...getNextMonthDayIndicesMonthly(dateIterator));
                break;
            case 'Quarterly':
                dateIterator.setMonth(...getNextMonthDayIndicesQuarterly(dateIterator));
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
};

const getNextMonthDayIndicesMonthly = (currentDate: Date): [number, number] => {
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
};

const getNextMonthDayIndicesQuarterly = (currentDate: Date): [number, number] => {
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
};

export { getChoresFromChoreGenerator };
