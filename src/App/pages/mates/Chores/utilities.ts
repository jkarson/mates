import { MatesUser } from '../../../common/models';
import {
    isSameDayMonthYear,
    getMaxDate,
    generateDates,
    isPreviousDate,
    getTodaysDate,
    initializeDates,
    getPostOptions,
    getDeleteOptions,
} from '../../../common/utilities';
import {
    ChoreGenerator,
    ChoreWithoutId,
    ChoreGeneratorWithoutId,
    ChoresInfo,
} from './models/ChoresInfo';
import { ServerChoresInfo } from './models/ServerChoresInfo';

export const updateChoresFromChoreGenerators = (
    choreGenerators: ChoreGenerator[],
    matesUser: MatesUser,
    setMatesUser: React.Dispatch<React.SetStateAction<MatesUser>>,
) => {
    console.log('hi from updateChores effect');
    const newChores: ChoreWithoutId[] = [];

    // Only proceed if user has chore generators to update
    if (
        choreGenerators.filter((chore) => !isSameDayMonthYear(chore.updatedThrough, getMaxDate()))
            .length === 0
    ) {
        console.log('nothing to update, returning');
        return false;
    }

    choreGenerators.forEach((choreGenerator) => {
        const generatedChores = getChoresWithoutIdFromChoreGenerator(choreGenerator);
        newChores.push(...generatedChores);
    });

    const data = {
        apartmentId: matesUser.apartment._id,
        updatedThrough: getMaxDate(),
        newChores: newChores,
    };
    console.log(data);

    const options = getPostOptions(data);
    fetch('/mates/addChoresAndUpdateChoreGenerators', options).then((res) =>
        res.json().then((json) => {
            console.log(json);
            const { authenticated, success } = json;
            if (!authenticated) {
                return true;
            }
            if (!success) {
                return false;
            }
            const { choresInfo } = json;
            const formattedChoresInfo = initializeServerChoresInfo(choresInfo);
            setMatesUser({
                ...matesUser,
                apartment: { ...matesUser.apartment, choresInfo: formattedChoresInfo },
            });
        }),
    );
};

export const getChoresWithoutIdFromChoreGenerator = ({
    _id: id,
    name,
    assigneeIds,
    showUntilCompleted,
    frequency,
    starting,
    updatedThrough,
}: ChoreGenerator): ChoreWithoutId[] => {
    const generationStartDate = new Date(updatedThrough.getTime());
    generationStartDate.setDate(generationStartDate.getDate() + 1);
    const choreDates = generateDates(starting, generationStartDate, frequency);
    return choreDates.map((date) => {
        return {
            choreGeneratorId: id,
            name: name,
            assigneeIds: [...assigneeIds],
            showUntilCompleted: showUntilCompleted,
            completed: false,
            date: date,
        };
    });
};

export const getChoresWithoutIdFromChoreGeneratorWithoutId = ({
    name,
    assigneeIds,
    showUntilCompleted,
    frequency,
    starting,
    updatedThrough,
}: ChoreGeneratorWithoutId): ChoreWithoutId[] => {
    const generationStartDate = new Date(updatedThrough.getTime());
    generationStartDate.setDate(generationStartDate.getDate() + 1);
    const choreDates = generateDates(starting, generationStartDate, frequency);
    return choreDates.map((date) => {
        return {
            choreGeneratorId: 'TBD',
            name: name,
            assigneeIds: [...assigneeIds],
            showUntilCompleted: showUntilCompleted,
            completed: false,
            date: date,
        };
    });
};

export const purgeOldChores = (
    matesUser: MatesUser,
    setMatesUser: React.Dispatch<React.SetStateAction<MatesUser>>,
) => {
    console.log('hi from purge old chores');
    const existingChores = matesUser.apartment.choresInfo.chores;
    const choreDeletionIds: string[] = [];

    existingChores.forEach((chore) => {
        if (
            (isPreviousDate(chore.date, getTodaysDate()) &&
                !chore.completed &&
                !chore.showUntilCompleted) ||
            (isPreviousDate(chore.date, getMinDate()) && chore.completed)
        ) {
            choreDeletionIds.push(chore._id);
        }
    });

    if (choreDeletionIds.length === 0) {
        console.log('nothing to delete, returning');
        return false;
    }

    const data = {
        apartmentId: matesUser.apartment._id,
        choreDeletionIds: choreDeletionIds,
    };
    const options = getDeleteOptions(data);
    fetch('/mates/deleteOldChores', options).then((res) =>
        res.json().then((json) => {
            console.log('delete old chores response:');
            console.log(json);
            const { authenticated, success } = json;
            if (!authenticated) {
                return true;
            }
            if (!success) {
                return false;
            }
            const { choresInfo } = json;
            const formattedChoresInfo = initializeServerChoresInfo(choresInfo);
            setMatesUser({
                ...matesUser,
                apartment: { ...matesUser.apartment, choresInfo: formattedChoresInfo },
            });
            return false;
        }),
    );
};

// Completed chores will be deleted after they are 1 month old.
const getMinDate = () => {
    const current = getTodaysDate();
    const currentMonth = current.getMonth();
    current.setMonth(currentMonth - 1);
    return current;
};

export const initializeServerChoresInfo = (choresInfo: ServerChoresInfo) => {
    initializeDates(choresInfo.choreGenerators, 'starting');
    initializeDates(choresInfo.choreGenerators, 'updatedThrough');
    initializeDates(choresInfo.chores, 'date');
    return (choresInfo as unknown) as ChoresInfo;
};
