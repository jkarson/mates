import React, { useContext, useRef } from 'react';
import { UserContext, UserContextType } from '../../../../common/context';
import {
    verifyAndSetNumericStringInput,
    divideMoneyTotal,
    roundToTenth,
    getPercent,
    getTenantByTenantId,
    roundToHundredth,
    getAmountFromPercent,
    handleFocusNumericStringInput,
    handleBlurNumericStringInput,
} from '../../../../common/utilities';
import { AmountWithPercentOwed } from '../models/AmountWithPercentOwed';
import { getTotalAssignedValue } from '../utilities';

interface AmountsWithPercentOwedAssignmentCellProps {
    amountsWithPercentOwed: AmountWithPercentOwed[];
    setAmountsWithPercentOwed: (amountsWithPercentOwed: AmountWithPercentOwed[]) => void;
    total: string;
    totalValue: number;
    setTotal: (total: string) => void;
    isPrivate: boolean;
}

const AmountsWithPercentOwedAssignmentCell: React.FC<AmountsWithPercentOwedAssignmentCellProps> = ({
    amountsWithPercentOwed,
    setAmountsWithPercentOwed,
    total,
    totalValue,
    setTotal,
    isPrivate,
}) => {
    const { user } = useContext(UserContext) as UserContextType;

    const handleSetAmountWithPercentOwed = (amountWithPercentOwed: AmountWithPercentOwed) => {
        const id = amountWithPercentOwed.tenantId;
        const index = amountsWithPercentOwed.findIndex((aWPO) => aWPO.tenantId === id);
        amountsWithPercentOwed.splice(index, 1, amountWithPercentOwed);
        setAmountsWithPercentOwed(amountsWithPercentOwed);
    };

    const handleSetTotal = (event: React.ChangeEvent<HTMLInputElement>) => {
        verifyAndSetNumericStringInput(event, setTotal, 2);
    };

    const handleSplitEvenly = () => {
        const numTenants = amountsWithPercentOwed.length;
        const values = divideMoneyTotal(totalValue, numTenants);
        const newAmountsWithPercentOwed: AmountWithPercentOwed[] = amountsWithPercentOwed.map(
            (amountOwed, index) => ({
                tenantId: amountOwed.tenantId,
                amount: values[index].toFixed(2),
                amountValue: values[index],
                percent: roundToTenth(getPercent(values[index], totalValue)).toFixed(1),
                percentValue: roundToTenth(getPercent(values[index], totalValue)),
            }),
        );
        setAmountsWithPercentOwed(newAmountsWithPercentOwed);
    };

    const tenantAssignmentCells = amountsWithPercentOwed.map((aWPO) => {
        const tenant = getTenantByTenantId(user, aWPO.tenantId);
        const tenantName = tenant ? tenant.name : 'UNKNOWN';

        const setAmount = (amount: string) => {
            if (amount !== aWPO.amount) {
                const newAmountValue = isNaN(parseFloat(amount))
                    ? 0
                    : roundToHundredth(parseFloat(amount));
                const newPercentValue = roundToTenth(getPercent(newAmountValue, totalValue));
                const newPercent = newPercentValue.toFixed(1);
                const newAmountWithPercentOwed: AmountWithPercentOwed = {
                    tenantId: aWPO.tenantId,
                    amount: amount,
                    amountValue: newAmountValue,
                    percent: newPercent,
                    percentValue: newPercentValue,
                };
                handleSetAmountWithPercentOwed(newAmountWithPercentOwed);
            }
        };

        const setPercent = (percent: string) => {
            if (percent !== aWPO.percent) {
                const newPercent = percent;
                const newPercentValue = isNaN(parseFloat(percent))
                    ? 0
                    : roundToTenth(parseFloat(percent));
                const newAmountValue = roundToHundredth(
                    getAmountFromPercent(newPercentValue, totalValue),
                );
                const newAmount = newAmountValue.toFixed(2);
                const newAmountWithPercentOwed: AmountWithPercentOwed = {
                    tenantId: aWPO.tenantId,
                    amount: newAmount,
                    amountValue: newAmountValue,
                    percent: newPercent,
                    percentValue: newPercentValue,
                };
                handleSetAmountWithPercentOwed(newAmountWithPercentOwed);
            }
        };

        return (
            <TenantAmountAssignmentCell
                name={tenantName}
                amount={aWPO.amount}
                percent={aWPO.percent}
                setAmount={setAmount}
                setPercent={setPercent}
            />
        );
    });

    const totalInput = useRef<HTMLInputElement>(null);
    return (
        <div style={{ marginTop: 20 }}>
            <label style={{ fontWeight: 'bold' }}>
                {'Total Owed: $'}
                <input
                    ref={totalInput}
                    type="string"
                    value={total}
                    onChange={handleSetTotal}
                    onFocus={() => handleFocusNumericStringInput(totalInput, setTotal)}
                    onBlur={() => handleBlurNumericStringInput(totalInput, setTotal, 2)}
                />
            </label>
            {isPrivate ? null : (
                <div>
                    {tenantAssignmentCells}
                    <button onClick={handleSplitEvenly}>{'Split Total Evenly'}</button>
                    <TotalAssignedCell
                        totalNeeded={totalValue}
                        totalAssigned={getTotalAssignedValue(amountsWithPercentOwed)}
                    />
                </div>
            )}
        </div>
    );
};

interface TenantAmountAssignmentCellProps {
    name: string;
    amount: string;
    percent: string;
    setAmount: (amount: string) => void;
    setPercent: (percent: string) => void;
}

const TenantAmountAssignmentCell: React.FC<TenantAmountAssignmentCellProps> = ({
    name,
    amount,
    percent,
    setAmount,
    setPercent,
}) => {
    const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        verifyAndSetNumericStringInput(event, setAmount, 2);
    };

    const handleChangePercent = (event: React.ChangeEvent<HTMLInputElement>) => {
        verifyAndSetNumericStringInput(event, setPercent, 1);
    };

    const amountInput = useRef<HTMLInputElement>(null);
    const percentInput = useRef<HTMLInputElement>(null);
    return (
        <div>
            <p style={{ fontWeight: 'bold' }}>{name}</p>
            <label>
                {'$'}
                <input
                    ref={amountInput}
                    type="string"
                    value={amount}
                    onChange={handleChangeAmount}
                    onFocus={() => handleFocusNumericStringInput(amountInput, setAmount)}
                    onBlur={() => handleBlurNumericStringInput(amountInput, setAmount, 2)}
                />
            </label>
            <label>
                {'%'}
                <input
                    ref={percentInput}
                    type="string"
                    value={percent}
                    onChange={handleChangePercent}
                    onFocus={() => handleFocusNumericStringInput(percentInput, setPercent)}
                    onBlur={() => handleBlurNumericStringInput(percentInput, setPercent, 1)}
                />
            </label>
        </div>
    );
};

interface TotalAssignedCellProps {
    totalNeeded: number;
    totalAssigned: number;
}

const TotalAssignedCell: React.FC<TotalAssignedCellProps> = ({ totalNeeded, totalAssigned }) => {
    const difference = roundToHundredth(totalNeeded - totalAssigned);
    return (
        <div>
            <p style={{ fontWeight: 'bold' }}>
                {'Assigned total: $'}
                <span style={difference === 0 ? { color: 'green' } : { color: 'red' }}>
                    {totalAssigned.toFixed(2)}
                </span>
            </p>
            {difference > 0 ? (
                <p>{'Please assign $' + difference.toFixed(2)}</p>
            ) : difference < 0 ? (
                <p>{'You have assigned $' + (-1 * difference).toFixed(2) + ' too much.'}</p>
            ) : null}
        </div>
    );
};

export default AmountsWithPercentOwedAssignmentCell;
