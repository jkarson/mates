import React from 'react';

import '../styles/AmountOwedDisplayCell.css';

interface AmountOwedDisplayCellProps {
    name: string;
    currentAmount: number;
    initialAmount: number;
}

type AmountOwedDisplayCellMode = 'paid' | 'owes' | 'is owed';

const AmountOwedDisplayCell: React.FC<AmountOwedDisplayCellProps> = ({
    name,
    currentAmount,
    initialAmount,
}) => {
    let verb: AmountOwedDisplayCellMode;
    let amount = '';
    if (currentAmount === 0 && initialAmount > 0) {
        verb = 'paid';
        amount = initialAmount.toFixed(2);
    } else if (currentAmount >= 0) {
        verb = 'owes';
        amount = currentAmount.toFixed(2);
    } else {
        verb = 'is owed';
        amount = (-1 * currentAmount).toFixed(2);
    }
    return (
        <div className="amount-owed-display-cell-container">
            <div className="amount-owed-display-cell-name-container">
                <span>{name}</span>
            </div>
            <div className="amount-owed-display-cell-verb-dollar-amount-container">
                <div className="amount-owed-display-cell-verb-container">
                    <span>{verb}</span>
                </div>
                <div className="amount-owed-display-cell-dollar-amount-container">
                    <i className="fa fa-usd" />
                    <div
                        className={
                            verb === 'paid'
                                ? 'amount-owed-display-cell-amount-black-container'
                                : verb === 'is owed'
                                ? 'amount-owed-display-cell-amount-green-container'
                                : 'amount-owed-display-cell-amount-red-container'
                        }
                    >
                        <span>{amount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AmountOwedDisplayCell;
