import React from 'react';
import { MatesUser } from '../../../common/models';
import {
    roundToHundredth,
    isSameDayMonthYear,
    getMaxDate,
    generateDates,
    isPreviousDate,
    getTodaysDate,
    getPostOptions,
    initializeDates,
    getDeleteOptions,
    //getLaterDateToTest,
} from '../../../common/utilities';
import { AmountOwed } from './models/AmountOwed';
import { AmountWithPercentOwed } from './models/AmountWithPercentOwed';
import {
    BillGenerator,
    BillWithoutId,
    BillGeneratorWithoutId,
    BillsInfo,
} from './models/BillsInfo';
import { ServerBillsInfo } from './models/ServerBillsInfo';

export const getInitialAmountsWithPercentOwed = (matesUser: MatesUser): AmountWithPercentOwed[] => {
    const tenants = matesUser.apartment.tenants;
    const amountsOwed = tenants.map((tenant) => ({
        userId: tenant.userId,
        amount: '0.00',
        amountValue: 0,
        percent: '0.0',
        percentValue: 0,
    }));
    return amountsOwed;
};

export const getTotalAssignedValue = (amountsWithPercentOwed: AmountWithPercentOwed[]) => {
    const amountsAssigned = amountsWithPercentOwed.map((aWPO) => aWPO.amountValue);
    let totalAssigned: number = 0;
    amountsAssigned.forEach((amount) => {
        if (!isNaN(amount)) {
            totalAssigned += amount;
        }
    });
    return roundToHundredth(totalAssigned);
};

export const getTotalCurrentAssignedValue = (amountsOwed: AmountOwed[]) => {
    const amountsAssigned = amountsOwed.map((amountOwed) => amountOwed.currentAmount);
    let totalAssigned: number = 0;
    amountsAssigned.forEach((amount) => {
        if (!isNaN(amount)) {
            totalAssigned += amount;
        }
    });
    return roundToHundredth(totalAssigned);
};

export const updateBillsFromBillGenerators = (
    billGenerators: BillGenerator[],
    matesUser: MatesUser,
    setMatesUser: React.Dispatch<React.SetStateAction<MatesUser>>,
) => {
    const newBills: BillWithoutId[] = [];

    // Only proceed if there are bills that actually need to be updated.
    if (
        billGenerators.filter(
            (billGenerator) => !isSameDayMonthYear(billGenerator.updatedThrough, getMaxDate()), //getLaterDateToTest()), //getMaxDate()), //,
        ).length === 0
    ) {
        return false;
    }

    billGenerators.forEach((billGenerator) => {
        const generatedBills = getBillsWithoutIdFromBillGenerator(billGenerator);
        newBills.push(...generatedBills);
    });
    const updatedThrough = getMaxDate(); //getLaterDateToTest();
    const data = {
        updatedThrough: updatedThrough,
        newBills: newBills,
        apartmentId: matesUser.apartment._id,
    };
    const options = getPostOptions(data);
    fetch('/mates/addBillsAndUpdateBillGenerators', options)
        .then((res) => res.json())
        .then((json) => {
            console.log(json);
            const { authenticated, success } = json;
            if (!authenticated) {
                return true;
            }
            if (!success) {
                return false; //note: ideally, this should never occur;
                //if it does, I don't see a reason for the user to be notified
            }
            const { billsInfo } = json;
            initializeServerBillsInfo(billsInfo);
            setMatesUser({
                ...matesUser,
                apartment: { ...matesUser.apartment, billsInfo: billsInfo },
            });
        });
};

export const getBillsWithoutIdFromBillGeneratorWithoutId = ({
    name,
    payableTo,
    isPrivate,
    privateTenantId,
    frequency,
    amountsWithPercentOwed,
    starting,
    updatedThrough,
}: BillGeneratorWithoutId) => {
    const generationStartDate = new Date(updatedThrough.getTime());
    generationStartDate.setDate(generationStartDate.getDate() + 1);
    const billDates = generateDates(starting, generationStartDate, frequency);
    return billDates.map((date) => {
        const amountsOwed = amountsWithPercentOwed.map((aWPO) => ({
            userId: aWPO.userId,
            initialAmount: aWPO.amountValue,
            currentAmount: aWPO.amountValue,
        }));

        return {
            billGeneratorId: 'TBD',
            name: name,
            payableTo: payableTo,
            isPrivate: isPrivate,
            privateTenantId: privateTenantId,
            amountsOwed: amountsOwed,
            date: date,
        };
    });
};

export const getBillsWithoutIdFromBillGenerator = ({
    _id,
    name,
    payableTo,
    isPrivate,
    privateTenantId,
    frequency,
    amountsWithPercentOwed,
    starting,
    updatedThrough,
}: BillGenerator) => {
    const generationStartDate = new Date(updatedThrough.getTime());
    generationStartDate.setDate(generationStartDate.getDate() + 1);
    const billDates = generateDates(starting, generationStartDate, frequency);
    return billDates.map((date) => {
        const amountsOwed = amountsWithPercentOwed.map((aWPO) => ({
            userId: aWPO.userId,
            initialAmount: aWPO.amountValue,
            currentAmount: aWPO.amountValue,
        }));

        return {
            billGeneratorId: _id,
            name: name,
            payableTo: payableTo,
            isPrivate: isPrivate,
            privateTenantId: privateTenantId,
            amountsOwed: amountsOwed,
            date: date,
        };
    });
};

export const purgeOldBills = (
    matesUser: MatesUser,
    setMatesUser: React.Dispatch<React.SetStateAction<MatesUser>>,
) => {
    console.log('hi from purge on client');
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
        console.log('no bills to purge');
        return false;
    }

    const data = {
        apartmentId: matesUser.apartment._id,
        billDeletionIds: billDeletionIds,
    };
    const options = getDeleteOptions(data);
    fetch('/mates/deleteOldBills', options)
        .then((res) => res.json())
        .then((json) => {
            console.log(json);
            const { authenticated, success } = json;
            if (!authenticated) {
                return true;
            }
            if (!success) {
                return false; //note: ideally, this should never occur;
                //if it does, I don't see a reason for the user to be notified
            }
            const { billsInfo } = json;
            initializeServerBillsInfo(billsInfo);

            setMatesUser({
                ...matesUser,
                apartment: { ...matesUser.apartment, billsInfo: billsInfo },
            });
            return false;
        });

    //setMatesUser({ ...matesUser });
    //}
};

// Resolved bills will be deleted after they are 3 month old.
export const getMinDate = () => {
    const current = getTodaysDate();
    const currentMonth = current.getMonth();
    current.setMonth(currentMonth - 3);
    return current;
};

export const initializeServerBillsInfo = (billsInfo: ServerBillsInfo) => {
    initializeDates(billsInfo.billGenerators, 'starting');
    initializeDates(billsInfo.billGenerators, 'updatedThrough');
    initializeDates(billsInfo.bills, 'date');
    return (billsInfo as unknown) as BillsInfo;
};
