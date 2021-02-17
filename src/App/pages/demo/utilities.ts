import { MatesUser } from '../../common/models';
import {
    isSameDayMonthYear,
    getMaxDate,
    isPreviousDate,
    getTodaysDate,
} from '../../common/utilities';
import { Bill, BillGenerator } from '../mates/Bills/models/BillsInfo';
import { getBillsWithoutIdFromBillGenerator, getMinDate } from '../mates/Bills/utilities';
import { Chore, ChoreGenerator } from '../mates/Chores/models/ChoresInfo';
import { getChoresWithoutIdFromChoreGenerator } from '../mates/Chores/utilities';

export const demoUpdateBillsFromBillGenerators = (
    billGenerators: BillGenerator[],
    matesUser: MatesUser,
    setMatesUser: React.Dispatch<React.SetStateAction<MatesUser>>,
) => {
    const newBills: Bill[] = [];

    // Only proceed if there are bills that actually need to be updated.
    if (
        billGenerators.filter(
            (billGenerator) => !isSameDayMonthYear(billGenerator.updatedThrough, getMaxDate()),
        ).length === 0
    ) {
        return false;
    }

    billGenerators.forEach((billGenerator) => {
        const generatedBills = getBillsWithoutIdFromBillGenerator(billGenerator);
        const newIds = getNewIds(matesUser.apartment.billsInfo.bills, '_id', generatedBills.length);
        const generatedBillsWithId = generatedBills.map((bill, index) => {
            return { ...bill, _id: newIds[index] };
        });
        billGenerator.updatedThrough = getMaxDate();
        newBills.push(...generatedBillsWithId);
    });
    matesUser.apartment.billsInfo.billGenerators = billGenerators;
    matesUser.apartment.billsInfo.bills = matesUser.apartment.billsInfo.bills.concat(newBills);
    setMatesUser({ ...matesUser });
};

export const demoPurgeOldBills = (
    matesUser: MatesUser,
    setMatesUser: React.Dispatch<React.SetStateAction<MatesUser>>,
) => {
    const bills = matesUser.apartment.billsInfo.bills;
    const billDeletionIds: string[] = [];

    bills.forEach((bill) => {
        if (
            bill.amountsOwed.every((amountOwned) => amountOwned.currentAmount === 0) &&
            isPreviousDate(bill.date, getMinDate())
        ) {
            billDeletionIds.push(bill._id);
        }
    });

    if (billDeletionIds.length === 0) {
        return false;
    }
    billDeletionIds.forEach((id) => {
        const billIndex = bills.findIndex((bill) => bill._id === id);
        if (billIndex !== -1) {
            bills.splice(billIndex, 1);
        }
    });
    setMatesUser({ ...matesUser });
};

export const demoUpdateChoresFromChoreGenerators = (
    choreGenerators: ChoreGenerator[],
    matesUser: MatesUser,
    setMatesUser: React.Dispatch<React.SetStateAction<MatesUser>>,
) => {
    const newChores: Chore[] = [];

    // Only proceed if user has chore generators to update
    if (
        choreGenerators.filter((chore) => !isSameDayMonthYear(chore.updatedThrough, getMaxDate()))
            .length === 0
    ) {
        return false;
    }

    choreGenerators.forEach((choreGenerator) => {
        const generatedChores = getChoresWithoutIdFromChoreGenerator(choreGenerator);
        const newIds = getNewIds(
            matesUser.apartment.choresInfo.chores,
            '_id',
            generatedChores.length,
        );
        const generatedChoresWithId = generatedChores.map((chore, index) => {
            return { ...chore, _id: newIds[index] };
        });
        newChores.push(...generatedChoresWithId);
        choreGenerator.updatedThrough = getMaxDate();
    });
    matesUser.apartment.choresInfo.choreGenerators = choreGenerators;
    matesUser.apartment.choresInfo.chores = matesUser.apartment.choresInfo.chores.concat(newChores);
    setMatesUser({ ...matesUser });
};

export const demoPurgeOldChores = (
    matesUser: MatesUser,
    setMatesUser: React.Dispatch<React.SetStateAction<MatesUser>>,
) => {
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
        return false;
    }
    choreDeletionIds.forEach((id) => {
        const choreIndex = existingChores.findIndex((chore) => chore._id === id);
        if (choreIndex !== -1) {
            existingChores.splice(choreIndex, 1);
        }
    });
    setMatesUser({ ...matesUser });
};

export const getNewId = (objectsWithId: any[], nameOfIdField: string) => {
    let maxId = -1;
    objectsWithId.forEach((objectWithId) => {
        if (parseInt(objectWithId[nameOfIdField], 10) > maxId) {
            maxId = parseInt(objectWithId._id, 10);
        }
    });
    maxId++;
    return maxId.toString();
};

export const getNewIds = (
    objectsWithId: any[],
    nameOfIdField: string,
    numberToGenerate: number,
) => {
    const newIds: string[] = [];
    const newId = parseInt(getNewId(objectsWithId, nameOfIdField), 10);
    let iterator = 0;
    for (iterator; iterator < numberToGenerate; iterator++) {
        const sum = newId + iterator;
        newIds.push(sum.toString());
    }
    return newIds;
};
