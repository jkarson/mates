import React, { useContext, useRef } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
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

import '../styles/AmountsWithPercentOwedAssignmentCell.css';
import TenantAmountAssignmentCell from './TenantAmountAssignmentCell';
import { SimpleButton } from '../../../../common/components/SimpleButtons';
import { StyledInputWithRef } from '../../../../common/components/StyledInputs';

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
    const { matesUser } = useContext(MatesUserContext) as MatesUserContextType;

    const handleSetAmountWithPercentOwed = (amountWithPercentOwed: AmountWithPercentOwed) => {
        const id = amountWithPercentOwed.userId;
        const index = amountsWithPercentOwed.findIndex((aWPO) => aWPO.userId === id);
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
                userId: amountOwed.userId,
                amount: values[index].toFixed(2),
                amountValue: values[index],
                percent: roundToTenth(getPercent(values[index], totalValue)).toFixed(1),
                percentValue: roundToTenth(getPercent(values[index], totalValue)),
            }),
        );
        setAmountsWithPercentOwed(newAmountsWithPercentOwed);
    };

    const isTotalAssigned = () =>
        roundToHundredth(totalValue - getTotalAssignedValue(amountsWithPercentOwed)) === 0 &&
        totalValue > 0;

    const tenantAssignmentCells = amountsWithPercentOwed.map((aWPO) => {
        const tenant = getTenantByTenantId(matesUser, aWPO.userId);
        const tenantName = tenant ? tenant.name : 'UNKNOWN';

        const setAmount = (amount: string) => {
            if (amount !== aWPO.amount) {
                const newAmountValue = isNaN(parseFloat(amount))
                    ? 0
                    : roundToHundredth(parseFloat(amount));
                const newPercentValue = roundToTenth(getPercent(newAmountValue, totalValue));
                const newPercent = newPercentValue.toFixed(1);
                const newAmountWithPercentOwed: AmountWithPercentOwed = {
                    userId: aWPO.userId,
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
                    userId: aWPO.userId,
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
                key={aWPO.userId}
            />
        );
    });

    const totalInput = useRef<HTMLInputElement>(null);
    return (
        <div
            className={
                isPrivate
                    ? 'amounts-with-percent-owed-assignment-cell-private-container'
                    : 'amounts-with-percent-owed-assignment-cell-container'
            }
        >
            <div className="amounts-with-percent-owed-assignment-cell-total-assigned-container">
                <div className="amounts-with-percent-owed-assignment-cell-total-container">
                    <span>{'Total Cost: '}</span>
                    <div className="amounts-with-percent-owed-assignment-cell-total-input-container">
                        <StyledInputWithRef
                            ref={totalInput}
                            type="string"
                            value={total}
                            onChange={handleSetTotal}
                            onFocus={() => handleFocusNumericStringInput(totalInput, setTotal)}
                            onBlur={() => handleBlurNumericStringInput(totalInput, setTotal, 2)}
                        />
                        <div className="amounts-with-percent-owed-assignment-cell-total-icon-container">
                            <i className="fa fa-usd" />
                        </div>
                    </div>
                </div>
                {isPrivate ? null : (
                    <div className="amounts-with-percent-owed-assignment-cell-assigned-container">
                        <span>{'Total Assigned: '}</span>
                        <div className="amounts-with-percent-owed-assignment-cell-assigned-value-container">
                            <div className="amounts-with-percent-owed-assignment-cell-assigned-icon-container">
                                <i className="fa fa-usd" />
                            </div>
                            <div
                                className={
                                    isTotalAssigned()
                                        ? 'amounts-with-percent-owed-assignment-cell-green-assigned-container'
                                        : 'amounts-with-percent-owed-assignment-cell-red-assigned-container'
                                }
                            >
                                <span>
                                    {getTotalAssignedValue(amountsWithPercentOwed).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isPrivate ? null : (
                <div>
                    {tenantAssignmentCells}
                    <div className="amounts-with-percent-owed-assignment-cell-split-button-container">
                        <SimpleButton onClick={handleSplitEvenly} text="Split Total Evenly" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AmountsWithPercentOwedAssignmentCell;
