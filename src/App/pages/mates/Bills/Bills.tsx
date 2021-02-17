import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import StandardStyledText from '../../../common/components/StandardStyledText';
import Tabs from '../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { UserId } from '../../../common/models';
import {
    getDeleteOptions,
    getPutOptions,
    getTodaysDate,
    isPreviousDate,
    assertUnreachable,
} from '../../../common/utilities';
import BillCell from './components/BillCell';
import BillSummaryCell from './components/BillSummaryCell';
import CreateBillGeneratorCell from './components/CreateBillGeneratorCell';
import { AmountOwed } from './models/AmountOwed';
import { BillId, BillGeneratorID, Bill } from './models/BillsInfo';
import { BillsTabType, billsTabNames } from './models/BillsTabs';
import {
    updateBillsFromBillGenerators,
    purgeOldBills,
    initializeServerBillsInfo,
    getTotalCurrentAssignedValue,
} from './utilities';

import './Bills.css';

//EXTENSION: make bills editable

//EXTENSION: Optimize useEffect calls w/ dependency arrays

//EXTENSION: bills summary should have some analytics about your spending, how much you owe/owed, etc

const Bills: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [tab, setTab] = useState<BillsTabType>('Overdue');
    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState('');
    const [serverCallMade, setServerCallMade] = useState(false);

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
        if (message !== 'Sorry, our server seems to be down.') {
            setMessage('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    useEffect(() => {
        const unauthenticated = updateBillsFromBillGenerators(billGenerators, user, setUser);
        if (unauthenticated) {
            setRedirect(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const unauthenticated = purgeOldBills(user, setUser);
        if (unauthenticated) {
            setRedirect(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteBill = (billId: BillId) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = {
            apartmentId: user.apartment._id,
            billId: billId,
        };
        const options = getDeleteOptions(data);
        fetch('/mates/deleteBill', options)
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, the bill could not be deleted at this time');
                    return;
                }
                const { billsInfo } = json;
                const formattedBillsInfo = initializeServerBillsInfo(billsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, billsInfo: formattedBillsInfo },
                });
                setMessage('Bill deleted.');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const handleDeleteBillSeries = (bgId: BillGeneratorID) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = {
            apartmentId: user.apartment._id,
            billGeneratorId: bgId,
        };
        const options = getDeleteOptions(data);
        fetch('mates/deleteBillSeries', options)
            .then((response) => response.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, the bill series could not be deleted at this time');
                    return;
                }
                const { billsInfo } = json;
                const formattedBillsInfo = initializeServerBillsInfo(billsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, billsInfo: formattedBillsInfo },
                });
                setMessage('Bill series deleted.');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const handleResolveBill = (billId: BillId) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const bill = bills.find((bill) => bill._id === billId) as Bill;
        bill.amountsOwed.forEach((amountOwed) => {
            amountOwed.currentAmount = 0;
        });
        const data = {
            apartmentId: user.apartment._id,
            billId: billId,
            amountsOwed: bill.amountsOwed,
        };
        const options = getPutOptions(data);
        fetch('/mates/updateAmountsOwed', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, your payment action could not be completed at this time.');
                    return;
                }
                const { billsInfo } = json;
                const formattedBillsInfo = initializeServerBillsInfo(billsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, billsInfo: formattedBillsInfo },
                });
                setMessage('Bill resolved.');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const handlePayPortionToPayable = (billId: BillId) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const bill = bills.find((bill) => bill._id === billId) as Bill;
        const userAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.userId === user.userId,
        ) as AmountOwed;
        userAmountOwed.currentAmount = 0;
        const data = {
            apartmentId: user.apartment._id,
            billId: billId,
            amountsOwed: bill.amountsOwed,
        };
        const options = getPutOptions(data);
        fetch('/mates/updateAmountsOwed', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, your payment action could not be completed at this time.');
                    return;
                }
                const { billsInfo } = json;
                const formattedBillsInfo = initializeServerBillsInfo(billsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, billsInfo: formattedBillsInfo },
                });
                setMessage('Portion paid to bill collector.');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const handlePayPortionToTenant = (billId: BillId, payeeId: UserId) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const bill = bills.find((bill) => bill._id === billId) as Bill;
        const userAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.userId === user.userId,
        ) as AmountOwed;
        const tenantAmountOwed = bill.amountsOwed.find(
            (amountOwed) => amountOwed.userId === payeeId,
        ) as AmountOwed;
        tenantAmountOwed.currentAmount += userAmountOwed.currentAmount;
        userAmountOwed.currentAmount = 0;
        const data = {
            apartmentId: user.apartment._id,
            billId: billId,
            amountsOwed: bill.amountsOwed,
        };
        const options = getPutOptions(data);
        fetch('/mates/updateAmountsOwed', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, your payment action could not be completed at this time.');
                    return;
                }
                const { billsInfo } = json;
                const formattedBillsInfo = initializeServerBillsInfo(billsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, billsInfo: formattedBillsInfo },
                });
                setMessage('Portion paid to tenant.');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const handlePayBalance = (billId: BillId) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
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
        const data = {
            apartmentId: user.apartment._id,
            billId: billId,
            amountsOwed: bill.amountsOwed,
        };
        const options = getPutOptions(data);
        fetch('/mates/updateAmountsOwed', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, your payment action could not be completed at this time.');
                    return;
                }
                const { billsInfo } = json;
                const formattedBillsInfo = initializeServerBillsInfo(billsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, billsInfo: formattedBillsInfo },
                });
                setMessage('Balance paid to bill collector.');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const handleResetBill = (billId: BillId) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const bill = bills.find((bill) => bill._id === billId) as Bill;
        bill.amountsOwed.forEach((amountOwed) => {
            amountOwed.currentAmount = amountOwed.initialAmount;
        });
        const data = {
            apartmentId: user.apartment._id,
            billId: billId,
            amountsOwed: bill.amountsOwed,
        };
        const options = getPutOptions(data);
        fetch('/mates/updateAmountsOwed', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, your payment action could not be completed at this time.');
                    return;
                }
                const { billsInfo } = json;
                const formattedBillsInfo = initializeServerBillsInfo(billsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, billsInfo: formattedBillsInfo },
                });
                setMessage('Bill Reset');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
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
            content = <CreateBillGeneratorCell setTab={setTab} />;
            break;
        default:
            assertUnreachable(tab);
    }

    if (redirect) {
        return <Redirect to="/" />;
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

interface BillsDescriptionCellProps {
    tab: BillsTabType;
}

export const BillsDescriptionCell: React.FC<BillsDescriptionCellProps> = ({ tab }) => {
    let content: string;
    switch (tab) {
        case 'Overdue':
            content =
                'These bills have an outstanding payable balance. Private bills will be highlighted in red.';
            break;
        case 'Unresolved':
            content =
                'These bills have been paid, but their date has passed and they still contain debts among roommates.';
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
    return <StandardStyledText text={content} />;
};

export default Bills;
