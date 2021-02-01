import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import DescriptionCell from '../../../common/components/DescriptionCell';
import Tabs from '../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { UserId } from '../../../common/models';
import { getTodaysDate, isPreviousDate, assertUnreachable } from '../../../common/utilities';
import BillCell from '../../mates/Bills/components/BillCell';
import BillGeneratorCell from '../../mates/Bills/components/BillGeneratorCell';
import { AmountOwed } from '../../mates/Bills/models/AmountOwed';
import { BillId, BillGeneratorID, Bill, BillGenerator } from '../../mates/Bills/models/BillsInfo';
import { BillsTabType, billsTabNames } from '../../mates/Bills/models/BillsTabs';
import { getTotalCurrentAssignedValue } from '../../mates/Bills/utilities';
import { purgeOldBillsDemo, updateBillsFromBillGeneratorsDemo } from '../utilities';
import DemoCreateBillGeneratorCell from './DemoCreateBillGeneratorCell';

const DemoBills: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [tab, setTab] = useState<BillsTabType>('Overdue');
    const [message, setMessage] = useState('');

    const billGenerators = user.apartment.billsInfo.billGenerators;
    const visibleBillGenerators = billGenerators.filter(
        (billGenerator) =>
            !billGenerator.isPrivate || billGenerator.privateTenantId === user.userId,
    );

    const bills = user.apartment.billsInfo.bills;
    const visibleBills = bills.filter(
        (bill) => !bill.isPrivate || bill.privateTenantId === user.userId,
    );

    useLayoutEffect(() => {
        if (getOverdueBills().length > 0) {
            setTab('Overdue');
            return;
        }
        if (getUnresolvedBills().length > 0) {
            setTab('Unresolved');
            return;
        }
        if (getUpcomingBills().length > 0) {
            setTab('Upcoming');
            return;
        }
        if (getFutureBills().length > 0) {
            setTab('Future');
            return;
        }
        setTab('Create New');
    }, []);

    useEffect(() => {
        setMessage('');
    }, [tab]);

    useEffect(() => {
        updateBillsFromBillGeneratorsDemo(billGenerators, user, setUser);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        purgeOldBillsDemo(user, setUser);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteBill = (billId: BillId) => {
        const billIndex = user.apartment.billsInfo.bills.findIndex((bill) => bill._id === billId);
        if (billIndex !== -1) {
            user.apartment.billsInfo.bills.splice(billIndex, 1);
        }
        setUser({ ...user });
        setMessage('Bill Deleted');
    };

    const handleDeleteBillSeries = (bgId: BillGeneratorID) => {
        const billsInSeries = user.apartment.billsInfo.bills.filter(
            (bill) => bill.billGeneratorId === bgId,
        );
        billsInSeries.forEach((billInSeries) => {
            const billIndex = user.apartment.billsInfo.bills.findIndex(
                (bill) => bill._id === billInSeries._id,
            );
            if (billIndex !== -1) {
                user.apartment.billsInfo.bills.splice(billIndex, 1);
            }
        });
        const billGeneratorIndex = user.apartment.billsInfo.billGenerators.findIndex(
            (bg) => bg._id === bgId,
        );
        if (billGeneratorIndex !== -1) {
            user.apartment.billsInfo.billGenerators.splice(billGeneratorIndex, 1);
        }
        setUser({ ...user });
        setMessage('Bill Series Deleted');
    };

    const handleResolveBill = (billId: BillId) => {
        const bill = bills.find((bill) => bill._id === billId) as Bill;
        bill.amountsOwed.forEach((amountOwed) => {
            amountOwed.currentAmount = 0;
        });
        setUser({ ...user });
        setMessage('Bill Resolved');
    };

    const handlePayPortionToPayable = (billId: BillId) => {
        const bill = bills.find((bill) => bill._id === billId) as Bill;
        const userAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.userId === user.userId,
        ) as AmountOwed;
        userAmountOwed.currentAmount = 0;
        setUser({ ...user });
        setMessage('Portion Paid To Vendor');
    };

    const handlePayPortionToTenant = (billId: BillId, payeeId: UserId) => {
        const bill = bills.find((bill) => bill._id === billId) as Bill;
        const userAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.userId === user.userId,
        ) as AmountOwed;
        const tenantAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.userId === payeeId,
        ) as AmountOwed;
        tenantAmountOwed.currentAmount += userAmountOwed.currentAmount;
        userAmountOwed.currentAmount = 0;
        setUser({ ...user });
        setMessage('Portion Paid To Tenant');
    };

    const handlePayBalance = (billId: BillId) => {
        const bill = bills.find((bill) => bill._id === billId) as Bill;
        const userAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.userId === user.userId,
        ) as AmountOwed;
        userAmountOwed.currentAmount = 0;
        bill.amountsOwed.forEach((amountOwed) => {
            if (amountOwed.userId !== user.userId) {
                userAmountOwed.currentAmount -= amountOwed.currentAmount;
            }
        });
        setUser({ ...user });
        setMessage('Balance Paid To Vendor');
    };

    const handleResetBill = (billId: BillId) => {
        const bill = bills.find((bill) => bill._id === billId) as Bill;
        bill.amountsOwed.forEach((amountOwed) => {
            amountOwed.currentAmount = amountOwed.initialAmount;
        });
        setUser({ ...user });
        setMessage('Bill Reset');
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
            (amountOwed) => amountOwed.userId === user.userId,
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
            isResolved={isResolved(bill)}
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
            content = <DemoCreateBillGeneratorCell setTab={setTab} />;
            break;
        default:
            assertUnreachable(tab);
    }
    return (
        <div>
            <Tabs currentTab={tab} setTab={setTab} tabNames={billsTabNames} />
            <BillsDescriptionCell tab={tab} />
            {message.length === 0 ? null : <p style={{ color: 'red' }}>{message}</p>}
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

export default DemoBills;
