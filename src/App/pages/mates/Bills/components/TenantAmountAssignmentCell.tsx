import React, { useRef } from 'react';
import { StyledInputWithRef } from '../../../../common/components/StyledInput';
import {
    verifyAndSetNumericStringInput,
    handleFocusNumericStringInput,
    handleBlurNumericStringInput,
} from '../../../../common/utilities';

import '../styles/TenantAmountAssignmentCell.css';

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
        <div className="tenant-amount-assignment-cell-container">
            <div className="tenant-amount-assignment-cell-percent-container">
                <div className="tenant-amount-assignment-cell-percent-sign-container">
                    <i className="fa fa-percent" />
                </div>

                <StyledInputWithRef
                    ref={percentInput}
                    type="string"
                    value={percent}
                    onChange={handleChangePercent}
                    onFocus={() => handleFocusNumericStringInput(percentInput, setPercent)}
                    onBlur={() => handleBlurNumericStringInput(percentInput, setPercent, 1)}
                />
            </div>
            <div className="tenant-amount-assignment-cell-dollars-container">
                <div className="tenant-amount-assignment-cell-dollar-sign-container">
                    <i className="fa fa-usd" />
                </div>
                <StyledInputWithRef
                    ref={amountInput}
                    type="string"
                    value={amount}
                    onChange={handleChangeAmount}
                    onFocus={() => handleFocusNumericStringInput(amountInput, setAmount)}
                    onBlur={() => handleBlurNumericStringInput(amountInput, setAmount, 2)}
                />
            </div>
            <div className="tenant-amount-assignment-cell-name-container">
                <span>{name}</span>
            </div>
        </div>
    );
};

export default TenantAmountAssignmentCell;
