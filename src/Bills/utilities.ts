import React from 'react';
import { User } from '../Common/models';
import {
    isSameDayMonthYear,
    getMaxDate,
    getNewIds,
    generateDates,
    isPreviousDate,
    getTodaysDate,
    roundToHundredth,
} from '../Common/utilities';
import { AmountOwed } from './models/AmountOwed';
import { AmountWithPercentOwed } from './models/AmountWithPercentOwed';
import { Bill } from './models/Bill';
import { BillGenerator } from './models/BillGenerator';

export const getInitialAmountsWithPercentOwed = (user: User): AmountWithPercentOwed[] => {
    const tenants = user.apartment.tenants;
    const amountsOwed = tenants.map((tenant) => ({
        tenantId: tenant.id,
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
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>,
) => {
    const originalBills = user.apartment.billsInfo.bills;
    const newBills: Bill[] = [];

    // Only update user if user actually needs to be updated. This protects
    // against an infinite update loop.
    if (
        billGenerators.filter(
            (billGenerator) => !isSameDayMonthYear(billGenerator.updatedThrough, getMaxDate()),
        ).length === 0
    ) {
        return;
    }

    billGenerators.forEach((billGenerator) => {
        const { updatedThrough } = billGenerator;
        const generationStartDate = new Date(updatedThrough.getTime());
        generationStartDate.setDate(generationStartDate.getDate() + 1);
        const generatedBills = getBillsFromBillGenerator(
            billGenerator,
            originalBills.concat(newBills),
            generationStartDate,
        );
        newBills.push(...generatedBills);
        billGenerator.updatedThrough = getMaxDate();
    });
    user.apartment.billsInfo.bills.push(...newBills);
    setUser({ ...user });
    //TO DO: SAVE NEW BILLS TO DATABASE
};

const getBillsFromBillGenerator = (
    billGenerator: BillGenerator,
    previousBills: Bill[],
    generationStartDate: Date,
): Bill[] => {
    const billsWithoutId = getBillsWithoutIdFromBillGenerator(billGenerator, generationStartDate);
    const newIds = getNewIds(previousBills, billsWithoutId.length);
    const bills: Bill[] = [];
    billsWithoutId.forEach((bill, index) => bills.push({ ...bill, id: newIds[index] }));
    return bills;
};

const getBillsWithoutIdFromBillGenerator = (
    {
        id,
        name,
        payableTo,
        isPrivate,
        privateTenantId,
        frequency,
        amountsWithPercentOwed,
        starting,
    }: BillGenerator,
    generationStartDate: Date,
) => {
    const billDates = generateDates(starting, generationStartDate, frequency);
    return billDates.map((date) => {
        const amountsOwed = amountsWithPercentOwed.map((aWPO) => ({
            tenantId: aWPO.tenantId,
            initialAmount: aWPO.amountValue,
            currentAmount: aWPO.amountValue,
        }));

        return {
            billGeneratorId: id,
            name: name,
            payableTo: payableTo,
            isPrivate: isPrivate,
            privateTenantId: privateTenantId,
            amountsOwed: amountsOwed,
            date: date,
        };
    });
};

export const purgeOldBills = (user: User, setUser: React.Dispatch<React.SetStateAction<User>>) => {
    const bills = user.apartment.billsInfo.bills;
    const deletionIndices: number[] = [];

    bills.forEach((bill, index) => {
        if (
            bill.amountsOwed.every((amountOwned) => amountOwned.currentAmount === 0) &&
            isPreviousDate(bill.date, getMinDate())
        ) {
            deletionIndices.push(index);
        }
    });

    deletionIndices.forEach((index) => {
        bills.splice(index, 1);
    });

    if (deletionIndices.length > 0) {
        setUser({ ...user });
    }
};

// Resolved bills will be deleted after they are 3 month old.
const getMinDate = () => {
    const current = getTodaysDate();
    const currentMonth = current.getMonth();
    current.setMonth(currentMonth - 3);
    return current;
};
