import { User } from '../Common/models';
import {
    generateDates,
    getMaxDate,
    getNewIds,
    getTodaysDate,
    isPreviousDate,
    isSameDayMonthYear,
} from '../Common/utilities';
import { Chore, ChoreWithoutId } from './models/Chore';
import { ChoreGenerator } from './models/ChoreGenerator';

export const updateChoresFromChoreGenerators = (
    choreGenerators: ChoreGenerator[],
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>,
) => {
    const originalChores = user.apartment.choresInfo.chores;
    const newChores: Chore[] = [];

    // Only update user if user actually needs to be updated. This protects
    // against an infinite update loop.
    if (
        choreGenerators.filter((chore) => !isSameDayMonthYear(chore.updatedThrough, getMaxDate()))
            .length === 0
    ) {
        return;
    }

    choreGenerators.forEach((choreGenerator) => {
        const { updatedThrough } = choreGenerator;
        const generationStartDate = new Date(updatedThrough.getTime());
        generationStartDate.setDate(generationStartDate.getDate() + 1);
        const generatedChores = getChoresFromChoreGenerator(
            choreGenerator,
            originalChores.concat(newChores),
            generationStartDate,
        );
        newChores.push(...generatedChores);
        choreGenerator.updatedThrough = getMaxDate();
    });
    user.apartment.choresInfo.chores.push(...newChores);
    setUser({ ...user });
    //TO DO: SAVE NEW CHORES TO DATABASE
};

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
    const choreDates = generateDates(starting, generationStartDate, frequency);
    return choreDates.map((date) => {
        return {
            choreGeneratorID: id,
            name: name,
            assigneeIds: [...assigneeIds],
            showUntilCompleted: showUntilCompleted,
            completed: false,
            date: date,
        };
    });
};

export const purgeOldChores = (user: User, setUser: React.Dispatch<React.SetStateAction<User>>) => {
    const existingChores = user.apartment.choresInfo.chores;
    const deletionIndices: number[] = [];

    existingChores.forEach((chore, index) => {
        if (
            (isPreviousDate(chore.date, getTodaysDate()) &&
                !chore.completed &&
                !chore.showUntilCompleted) ||
            (isPreviousDate(chore.date, getMinDate()) && chore.completed)
        ) {
            deletionIndices.push(index);
        }
    });

    deletionIndices.forEach((index) => {
        existingChores.splice(index, 1);
    });

    if (deletionIndices.length > 0) {
        //TO DO: Save deletions to database
        setUser({ ...user });
    }
};

// Completed chores will be deleted after they are 1 month old.
const getMinDate = () => {
    const current = getTodaysDate();
    const currentMonth = current.getMonth();
    current.setMonth(currentMonth - 1);
    return current;
};
