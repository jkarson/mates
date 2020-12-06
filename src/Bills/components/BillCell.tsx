import React, { useContext } from 'react';
import { TenantId } from '../../Common/types';
import { getFormattedDateString, getTenantByTenantId } from '../../Common/utilities';
import { Bill, BillId } from '../models/Bill';
import { BillGeneratorID } from '../models/BillGenerator';
import { getTotalCurrentAssignedValue } from '../utilities';
import { AmountOwed } from '../models/AmountOwed';
import { UserContext, UserContextType } from '../../Common/context';

interface BillCellProps {
    bill: Bill;
    isPaid: boolean;
    isPrivate: boolean;
    userPortionIsPaid: boolean;
    handleDeleteBill: (billId: BillId) => void;
    handleDeleteBillSeries: (bgId: BillGeneratorID) => void;
    handleResolveBill: (billId: BillId) => void;
    handlePayPortionToPayable: (billId: BillId) => void;
    handlePayPortionToTenant: (billId: BillId, payeeId: TenantId) => void;
    handlePayBalance: (billId: BillId) => void;
    handleResetBill: (billId: BillId) => void;
}

const BillCell: React.FC<BillCellProps> = ({
    bill,
    isPaid,
    isPrivate,
    userPortionIsPaid,
    handleDeleteBill,
    handleDeleteBillSeries,
    handleResolveBill,
    handlePayPortionToPayable,
    handlePayPortionToTenant,
    handlePayBalance,
    handleResetBill,
}) => {
    const handlePayPortionToTenantBound = handlePayPortionToTenant.bind(null, bill.id);
    return (
        <div style={{ borderBottom: '1px solid black' }}>
            <span style={bill.isPrivate ? { color: 'red' } : {}}>
                <p style={{ fontWeight: 'bold' }}>{bill.name}</p>
                <PayableToDisplayCell
                    billId={bill.id}
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
            {isPrivate ? null : (
                <button onClick={() => handleResolveBill(bill.id)}>{'Resolve all debts.'}</button>
            )}
            <button onClick={() => handleResetBill(bill.id)}>{'Reset'}</button>
            <button onClick={() => handleDeleteBill(bill.id)}>{'Delete Bill'}</button>
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
    handlePayPortionToTenant: (payeeId: TenantId) => void;
}

//TO DO: make sure it's protected from 2 users paying the bill at the same time.
//this will require the server i would think.
const AmountsOwedDisplayCell: React.FC<AmountsOwedDisplayCellProps> = ({
    amountsOwed,
    userPortionIsPaid,
    isPrivate,
    handlePayPortionToTenant,
}) => {
    const { user } = useContext(UserContext) as UserContextType;
    const content = amountsOwed.map((amountOwed) => {
        const { tenantId, currentAmount, initialAmount } = amountOwed;
        const tenant = getTenantByTenantId(user, tenantId);
        if (tenant === undefined || (isPrivate && tenant.id !== user.tenantId)) {
            return null;
        } else if (amountOwed.tenantId === user.tenantId) {
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
                        <button onClick={() => handlePayPortionToTenant(tenant.id)}>
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
        content = name + ' paid $' + initialAmount;
    } else if (currentAmount >= 0) {
        content = name + ' owes $' + currentAmount;
    } else {
        content = name + ' is owed $' + -1 * currentAmount;
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
    const payableToString = payableTo + (isPaid ? ' (PAID)' : ' (BALANCE: $' + totalOwed + ')');
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
