import React from 'react';
import SimpleButton from '../../../../common/components/SimpleButton';
import { BillId } from '../models/BillsInfo';

import '../styles/PayableToDisplayCell.css';

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
    return (
        <div className="payable-to-display-cell-container">
            <div className="payable-to-display-cell-text-container">
                <div className="payable-to-display-cell-text-container-inner">
                    <div className="payable-to-display-cell-text-prefix-container">
                        <span>{'Payable to: '}</span>
                    </div>
                    <div className="payable-to-display-cell-payable-container">
                        <span>{payableTo}</span>
                    </div>
                    <div className={'payable-to-display-cell-suffix-container'}>
                        {isPaid ? (
                            <div className="payable-to-display-cell-suffix-paid-container">
                                <span>{'('}</span>
                                <span>{'Paid'}</span>
                                <span>{')'}</span>
                            </div>
                        ) : (
                            <div className="payable-to-display-cell-suffix-unpaid-container">
                                <span>{'(Balance:'}</span>
                                <div className="payable-to-display-cell-suffix-unpaid-icon-balance-container">
                                    <i className="fa fa-usd" />
                                    <div className="payable-to-display-cell-suffix-unpaid-balance-container">
                                        <span>{totalOwed.toFixed(2)}</span>
                                    </div>
                                </div>
                                <span>{')'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isPaid ? null : (
                <div className="payable-to-display-cell-buttons-container">
                    <div className="payable-to-display-cell-buttons-container-inner">
                        {userPortionIsPaid || isPrivate || isPaid ? null : (
                            <SimpleButton
                                onClick={() => handlePayPortionToPayable(billId)}
                                text="Pay Portion"
                            />
                        )}
                        {isPaid ? null : (
                            <SimpleButton
                                onClick={() => handlePayBalance(billId)}
                                text="Pay Remaining Balance"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayableToDisplayCell;
