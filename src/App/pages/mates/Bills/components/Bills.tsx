import React, { useContext, useEffect, useState } from 'react';
import DescriptionCell from '../../../../common/components/DescriptionCell';
import Tabs from '../../../../common/components/Tabs';
import { UserContext, UserContextType } from '../../../../common/context';
import { TenantId } from '../../../../common/models';
import { getTodaysDate, isPreviousDate, assertUnreachable } from '../../../../common/utilities';
import { AmountOwed } from '../models/AmountOwed';
import { Bill, BillId } from '../models/Bill';
import { BillGenerator, BillGeneratorID } from '../models/BillGenerator';
import { billsTabNames, BillsTabType } from '../models/BillsTabs';
import {
    purgeOldBills,
    updateBillsFromBillGenerators,
    getTotalCurrentAssignedValue,
} from '../utilities';
import BillCell from './BillCell';
import BillGeneratorCell from './BillGeneratorCell';
import CreateBillGeneratorCell from './CreateBillGeneratorCell';

//EXTENSION: make bills editable

//EXTENSION: Optimize useEffect calls w/ dependency arrays

//EXTENSION: bills summary should have some analytics about your spending, how much you owe/owed, etc

const Bills: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;

    const [tab, setTab] = useState<BillsTabType>('Overdue');

    const billGenerators = user.apartment.billsInfo.billGenerators;
    const visibleBillGenerators = billGenerators.filter(
        (billGenerator) =>
            !billGenerator.isPrivate || billGenerator.privateTenantId === user.tenantId,
    );

    const bills = user.apartment.billsInfo.bills;
    const visibleBills = bills.filter(
        (bill) => !bill.isPrivate || bill.privateTenantId === user.tenantId,
    );

    useEffect(() => {
        updateBillsFromBillGenerators(billGenerators, user, setUser);
    });

    useEffect(() => {
        purgeOldBills(user, setUser);
    });

    const handleDeleteBill = (billId: BillId) => {
        const billIndex = bills.findIndex((bill) => bill.id === billId);
        bills.splice(billIndex, 1);
        setUser({ ...user });
        //TO DO: Save to database
    };

    const handleDeleteBillSeries = (bgId: BillGeneratorID) => {
        const billsInSeries = bills.filter((bill) => bill.billGeneratorId === bgId);
        billsInSeries.forEach((bill) => bills.splice(bills.indexOf(bill), 1));
        const bgIndex = billGenerators.findIndex((bg) => bg.id === bgId);
        billGenerators.splice(bgIndex, 1);
        setUser({ ...user });
        //TO DO: Save to database
    };

    const handleResolveBill = (billId: BillId) => {
        const bill = bills.find((bill) => bill.id === billId) as Bill;
        bill.amountsOwed.forEach((amountOwed) => {
            amountOwed.currentAmount = 0;
        });
        setUser({ ...user });
        //TO DO: Save to database
    };

    const handlePayPortionToPayable = (billId: BillId) => {
        const bill = bills.find((bill) => bill.id === billId) as Bill;
        const userAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.tenantId === user.tenantId,
        ) as AmountOwed;
        userAmountOwed.currentAmount = 0;
        setUser({ ...user });
        //TO DO: Save to database
    };

    const handlePayPortionToTenant = (billId: BillId, payeeId: TenantId) => {
        const bill = bills.find((bill) => bill.id === billId) as Bill;
        const userAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.tenantId === user.tenantId,
        ) as AmountOwed;
        const tenantAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.tenantId === payeeId,
        ) as AmountOwed;
        tenantAmountOwed.currentAmount += userAmountOwed.currentAmount;
        userAmountOwed.currentAmount = 0;
        setUser({ ...user });
        //TO DO: Save to database
    };

    const handlePayBalance = (billId: BillId) => {
        const bill = bills.find((bill) => bill.id === billId) as Bill;
        const userAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.tenantId === user.tenantId,
        ) as AmountOwed;
        userAmountOwed.currentAmount = 0;
        bill.amountsOwed.forEach((amountOwed) => {
            if (amountOwed.tenantId !== user.tenantId) {
                userAmountOwed.currentAmount -= amountOwed.currentAmount;
            }
        });
        setUser({ ...user });
        //TO DO: Save to database
    };

    const handleResetBill = (billId: BillId) => {
        const bill = bills.find((bill) => bill.id === billId) as Bill;
        bill.amountsOwed.forEach((amountOwed) => {
            amountOwed.currentAmount = amountOwed.initialAmount;
        });
        setUser({ ...user });
        //TO DO: Save to database
    };

    const upcomingDateLimit = getTodaysDate();
    upcomingDateLimit.setMonth(upcomingDateLimit.getMonth() + 1, upcomingDateLimit.getDate() + 1);

    const isResolved = (bill: Bill) =>
        bill.amountsOwed.every((amountOwed) => amountOwed.currentAmount === 0);

    const isPaid = (bill: Bill) => {
        return getTotalCurrentAssignedValue(bill.amountsOwed) === 0;
    };

    const userPortionIsPaid = (bill: Bill) => {
        const userAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.tenantId === user.tenantId,
        ) as AmountOwed;
        return userAmountOwed.currentAmount <= 0;
    };

    const sort = (billList: Bill[]) => {
        return billList.sort((a, b) => a.date.getTime() - b.date.getTime());
    };

    const getPastBills = () =>
        sort(visibleBills.filter((bill) => isPreviousDate(bill.date, getTodaysDate())));

    const getNotPastBills = () =>
        sort(visibleBills.filter((bill) => !isPreviousDate(bill.date, getTodaysDate())));

    const getOverdueBills = () => sort(getPastBills().filter((bill) => !isPaid(bill)));

    const getUnresolvedBills = () =>
        sort(getPastBills().filter((bill) => isPaid(bill) && !isResolved(bill)));

    const getUpcomingBills = () =>
        sort(
            getNotPastBills().filter(
                (bill) => !isResolved(bill) && isPreviousDate(bill.date, upcomingDateLimit),
            ),
        );

    const getFutureBills = () =>
        sort(
            getNotPastBills().filter(
                (bill) => !isResolved(bill) && !isPreviousDate(bill.date, upcomingDateLimit),
            ),
        );

    const getResolvedBills = () =>
        sort(visibleBills.filter((bill) => isPaid(bill) && isResolved(bill)));

    const getBillCell = (bill: Bill) => (
        <BillCell
            bill={bill}
            isPaid={isPaid(bill)}
            isPrivate={bill.isPrivate}
            userPortionIsPaid={userPortionIsPaid(bill)}
            handleDeleteBill={handleDeleteBill}
            handleDeleteBillSeries={handleDeleteBillSeries}
            handleResolveBill={handleResolveBill}
            handlePayPortionToPayable={handlePayPortionToPayable}
            handlePayPortionToTenant={handlePayPortionToTenant}
            handlePayBalance={handlePayBalance}
            handleResetBill={handleResetBill}
        />
    );

    let content: JSX.Element;
    switch (tab) {
        case 'Overdue':
            content = <div>{getOverdueBills().map(getBillCell)}</div>;
            break;
        case 'Unresolved':
            content = <div>{getUnresolvedBills().map(getBillCell)}</div>;
            break;
        case 'Upcoming':
            content = <div>{getUpcomingBills().map(getBillCell)}</div>;
            break;
        case 'Future':
            content = <div>{getFutureBills().map(getBillCell)}</div>;
            break;
        case 'Resolved':
            content = <div>{getResolvedBills().map(getBillCell)}</div>;
            break;
        case 'Summary':
            content = (
                <BillSummaryCell
                    billGenerators={visibleBillGenerators}
                    handleDeleteBillSeries={handleDeleteBillSeries}
                />
            );
            break;
        case 'Create New':
            content = <CreateBillGeneratorCell setTab={setTab} />;
            break;
        default:
            assertUnreachable(tab);
    }

    return (
        <div>
            <Tabs currentTab={tab} setTab={setTab} tabNames={billsTabNames} />
            <BillsDescriptionCell tab={tab} />
            <div>{content}</div>
        </div>
    );
};

interface BillsDescriptionCellProps {
    tab: BillsTabType;
}

const BillsDescriptionCell: React.FC<BillsDescriptionCellProps> = ({ tab }) => {
    let content: string;
    switch (tab) {
        case 'Overdue':
            content =
                'These bills have an outstanding payable balance. Private bills will be highlighted in red.';
            break;
        case 'Unresolved':
            content = 'These bills have been paid but still contain debts among roommates.';
            break;
        case 'Upcoming':
            content =
                'These bills are coming due in the next month. Private bills will be highlighted in red.';
            break;
        case 'Future':
            content =
                'These bills are coming due in the next year. Private bills will be highlighted in red.';
            break;
        case 'Resolved':
            content =
                'These bills have been paid and are fully resolved. Resolved bills will be automatically deleted three months past their date. Private bills will be highlighted in red.';
            break;
        case 'Summary':
            content = 'This is a summary of your bills. Private bills will be highlighted in red.';
            break;
        case 'Create New':
            content = '';
            break;
        default:
            assertUnreachable(tab);
    }
    return <DescriptionCell content={content} />;
};

interface BillSummaryCellProps {
    billGenerators: BillGenerator[];
    handleDeleteBillSeries: (bgId: BillGeneratorID) => void;
}

const BillSummaryCell: React.FC<BillSummaryCellProps> = ({
    billGenerators,
    handleDeleteBillSeries,
}) => {
    const billGeneratorCells = billGenerators.map((billGenerator) => (
        <BillGeneratorCell
            billGenerator={billGenerator}
            handleDeleteBillSeries={handleDeleteBillSeries}
        />
    ));
    return <div>{billGeneratorCells}</div>;
};

export default Bills;
