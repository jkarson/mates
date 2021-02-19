import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import Tabs from '../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { UserId } from '../../../common/models';
import { getTodaysDate, isPreviousDate, assertUnreachable } from '../../../common/utilities';
import { BillsDescriptionCell } from '../../mates/Bills/Bills';
import BillCell from '../../mates/Bills/components/BillCell';
import BillSummaryCell from '../../mates/Bills/components/BillSummaryCell';
import { AmountOwed } from '../../mates/Bills/models/AmountOwed';
import { BillId, BillGeneratorID, Bill } from '../../mates/Bills/models/BillsInfo';
import { BillsTabType, billsTabNames } from '../../mates/Bills/models/BillsTabs';
import { getTotalCurrentAssignedValue } from '../../mates/Bills/utilities';
import { demoPurgeOldBills, demoUpdateBillsFromBillGenerators } from '../utilities';
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setMessage('');
    }, [tab]);

    useEffect(() => {
        demoUpdateBillsFromBillGenerators(billGenerators, user, setUser);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        demoPurgeOldBills(user, setUser);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteBill = (billId: BillId) => {
        const billIndex = user.apartment.billsInfo.bills.findIndex((bill) => bill._id === billId);
        if (billIndex !== -1) {
            user.apartment.billsInfo.bills.splice(billIndex, 1);
        }
        setUser({ ...user });
        setMessage('Bill deleted.');
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
        setMessage('Bill series deleted.');
    };

    const handleResolveBill = (billId: BillId) => {
        const bill = bills.find((bill) => bill._id === billId) as Bill;
        bill.amountsOwed.forEach((amountOwed) => {
            amountOwed.currentAmount = 0;
        });
        setUser({ ...user });
        setMessage('Bill resolved.');
    };

    const handlePayPortionToPayable = (billId: BillId) => {
        const bill = bills.find((bill) => bill._id === billId) as Bill;
        const userAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.userId === user.userId,
        ) as AmountOwed;
        userAmountOwed.currentAmount = 0;
        setUser({ ...user });
        setMessage('Portion paid to bill collector.');
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
        setMessage('Portion paid to tenant.');
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
        setMessage('Balance paid to bill collector.');
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

    const includesUser = (bill: Bill) => {
        const userAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.userId === user.userId,
        );
        return userAmountOwed !== undefined;
    };

    const userPortionIsPaid = (bill: Bill) => {
        if (includesUser(bill)) {
            const userAmountOwed = bill.amountsOwed.find(
                (amountOwed) => amountOwed.userId === user.userId,
            ) as AmountOwed;
            return userAmountOwed.currentAmount <= 0;
        } else {
            return true;
        }
    };

    const userPortionOwed = (bill: Bill) => {
        if (includesUser(bill)) {
            const userAmountOwed = bill.amountsOwed.find(
                (amountOwed) => amountOwed.userId === user.userId,
            ) as AmountOwed;
            return userAmountOwed.currentAmount;
        }
        return 0;
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
            includesUser={includesUser(bill)}
            userPortionOwed={userPortionOwed(bill)}
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
            key={bill._id}
        />
    );

    let content: JSX.Element;
    switch (tab) {
        case 'Overdue':
            content = (
                <div className="bills-content-list-container">
                    {getOverdueBills().map(getBillCell)}
                </div>
            );
            break;
        case 'Unresolved':
            content = (
                <div className="bills-content-list-container">
                    {getUnresolvedBills().map(getBillCell)}
                </div>
            );
            break;
        case 'Upcoming':
            content = (
                <div className="bills-content-list-container">
                    {getUpcomingBills().map(getBillCell)}
                </div>
            );
            break;
        case 'Future':
            content = (
                <div className="bills-content-list-container">
                    {getFutureBills().map(getBillCell)}
                </div>
            );
            break;
        case 'Resolved':
            content = (
                <div className="bills-content-list-container">
                    {getResolvedBills().map(getBillCell)}
                </div>
            );
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
        <div className="bills-container">
            <div className="bills-tabs-container">
                <Tabs currentTab={tab} setTab={setTab} tabNames={billsTabNames} />
            </div>
            {tab !== 'Create New' ? (
                <div className="bills-description-container">
                    <BillsDescriptionCell tab={tab} />
                </div>
            ) : null}
            {message.length === 0 ? null : (
                <div className="bills-error-container">
                    <RedMessageCell message={message} />
                </div>
            )}
            <div className="bills-content-container">{content}</div>
        </div>
    );
};

export default DemoBills;
