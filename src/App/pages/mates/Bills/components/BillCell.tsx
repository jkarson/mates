import React, { useContext } from 'react';
import { getTotalCurrentAssignedValue } from '../utilities';
import { AmountOwed } from '../models/AmountOwed';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { getFormattedDateString, getTenantByTenantId } from '../../../../common/utilities';
import { UserId } from '../../../../common/models';
import { Bill, BillId, BillGeneratorID } from '../models/BillsInfo';

interface BillCellProps {
    bill: Bill;
    isPaid: boolean;
    isPrivate: boolean;
    isResolved: boolean;
    userPortionIsPaid: boolean;
    handleDeleteBill: (billId: BillId) => void;
    handleDeleteBillSeries: (bgId: BillGeneratorID) => void;
    handleResolveBill: (billId: BillId) => void;
    handlePayPortionToPayable: (billId: BillId) => void;
    handlePayPortionToTenant: (billId: BillId, payeeId: UserId) => void;
    handlePayBalance: (billId: BillId) => void;
    handleResetBill: (billId: BillId) => void;
}

const BillCell: React.FC<BillCellProps> = ({
    bill,
    isPaid,
    isPrivate,
    isResolved,
    userPortionIsPaid,
    handleDeleteBill,
    handleDeleteBillSeries,
    handleResolveBill,
    handlePayPortionToPayable,
    handlePayPortionToTenant,
    handlePayBalance,
    handleResetBill,
}) => {
    const handlePayPortionToTenantBound = handlePayPortionToTenant.bind(null, bill._id);
    return (
        <div style={{ borderBottom: '1px solid black' }}>
            <span style={bill.isPrivate ? { color: 'red' } : {}}>
                <p style={{ fontWeight: 'bold' }}>{bill.name}</p>
                <PayableToDisplayCell
                    billId={bill._id}
                    payableTo={bill.payableTo}
                    isPaid={isPaid}
                    isPrivate={isPrivate}
                    userPortionIsPaid={userPortionIsPaid}
                    totalOwed={getTotalCurrentAssignedValue(bill.amountsOwed)}
                    handlePayPortionToPayable={handlePayPortionToPayable}
                    handlePayBalance={handlePayBalance}
                />
                <p>{getFormattedDateString(bill.date)}</p>
                <AmountsOwedDisplayCell
                    amountsOwed={bill.amountsOwed}
                    userPortionIsPaid={userPortionIsPaid}
                    isPrivate={isPrivate}
                    handlePayPortionToTenant={handlePayPortionToTenantBound}
                />
            </span>
            {isPrivate || isResolved ? null : (
                <button onClick={() => handleResolveBill(bill._id)}>{'Resolve all debts.'}</button>
            )}
            <button onClick={() => handleResetBill(bill._id)}>{'Reset'}</button>
            <button onClick={() => handleDeleteBill(bill._id)}>{'Delete Bill'}</button>
            <button onClick={() => handleDeleteBillSeries(bill.billGeneratorId)}>
                {'Delete Bill Series'}
            </button>
        </div>
    );
};

interface AmountsOwedDisplayCellProps {
    amountsOwed: AmountOwed[];
    userPortionIsPaid: boolean;
    isPrivate: boolean;
    handlePayPortionToTenant: (payeeId: UserId) => void;
}

const AmountsOwedDisplayCell: React.FC<AmountsOwedDisplayCellProps> = ({
    amountsOwed,
    userPortionIsPaid,
    isPrivate,
    handlePayPortionToTenant,
}) => {
    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    const content = amountsOwed.map((amountOwed) => {
        const { userId: tenantId, currentAmount, initialAmount } = amountOwed;
        const tenant = getTenantByTenantId(user, tenantId);
        if (tenant === undefined || (isPrivate && tenant.userId !== user.userId)) {
            return null;
        } else if (amountOwed.userId === user.userId) {
            return (
                <AmountOwedDisplayCell
                    name={tenant.name}
                    currentAmount={currentAmount}
                    initialAmount={initialAmount}
                />
            );
        } else {
            return (
                <div>
                    <AmountOwedDisplayCell
                        name={tenant.name}
                        currentAmount={currentAmount}
                        initialAmount={initialAmount}
                    />
                    {userPortionIsPaid ? null : (
                        <button onClick={() => handlePayPortionToTenant(tenant.userId)}>
                            {'Pay Portion'}
                        </button>
                    )}
                </div>
            );
        }
    });
    return <div>{content}</div>;
};

interface AmountOwedDisplayCellProps {
    name: string;
    currentAmount: number;
    initialAmount: number;
}

const AmountOwedDisplayCell: React.FC<AmountOwedDisplayCellProps> = ({
    name,
    currentAmount,
    initialAmount,
}) => {
    let content = '';
    if (currentAmount === 0 && initialAmount > 0) {
        content = name + ' paid $' + initialAmount.toFixed(2);
    } else if (currentAmount >= 0) {
        content = name + ' owes $' + currentAmount.toFixed(2);
    } else {
        content = name + ' is owed $' + (-1 * currentAmount).toFixed(2);
    }
    return (
        <div>
            <p>{content}</p>
        </div>
    );
};

interface PayableToDisplayCellProps {
    billId: BillId;
    payableTo: string;
    isPaid: boolean;
    isPrivate: boolean;
    totalOwed: number;
    userPortionIsPaid: boolean;
    handlePayPortionToPayable: (billId: BillId) => void;
    handlePayBalance: (billId: BillId) => void;
}

const PayableToDisplayCell: React.FC<PayableToDisplayCellProps> = ({
    billId,
    payableTo,
    isPaid,
    isPrivate,
    totalOwed,
    userPortionIsPaid,
    handlePayPortionToPayable,
    handlePayBalance,
}) => {
    const payableToString =
        payableTo + (isPaid ? ' (PAID)' : ' (BALANCE: $' + totalOwed.toFixed(2) + ')');
    return (
        <div>
            <p>
                <u>{'Payable to:'}</u>
                {' ' + payableToString}
            </p>
            {userPortionIsPaid || isPrivate ? null : (
                <button onClick={() => handlePayPortionToPayable(billId)}>{'Pay Portion'}</button>
            )}
            {isPaid ? null : (
                <button onClick={() => handlePayBalance(billId)}>{'Pay Balance'}</button>
            )}
        </div>
    );
};

export default BillCell;
