import React, { useContext } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { getTenantByTenantId } from '../../../../common/utilities';
import { AmountWithPercentOwed } from '../models/AmountWithPercentOwed';
import { getTotalAssignedValue } from '../utilities';

import '../styles/AmountsWithPercentOwedDisplayCell.css';

interface AmountsWithPercentOwedDisplayCellProps {
    amountsWithPercentOwed: AmountWithPercentOwed[];
}

const AmountsWithPercentOwedDisplayCell: React.FC<AmountsWithPercentOwedDisplayCellProps> = ({
    amountsWithPercentOwed,
}) => {
    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    const content = amountsWithPercentOwed
        .filter((aWPO) => aWPO.percentValue > 0)
        .map((aWPO) => {
            const tenant = getTenantByTenantId(user, aWPO.userId);
            const tenantName = tenant ? tenant.name : 'Unknown';
            return (
                <TenantOwedDisplayCell
                    name={tenantName}
                    amountOwed={aWPO.amount}
                    key={aWPO.userId}
                />
            );
        });
    const header = (
        <TotalAmountOwed amount={getTotalAssignedValue(amountsWithPercentOwed).toFixed(2)} />
    );

    return (
        <div className="amounts-with-percent-owed-display-cell-container">
            {header ? (
                <div className="amounts-with-percent-owed-header-container">
                    <span>{header}</span>
                </div>
            ) : null}
            <div className="amounts-with-percent-owed-display-cell-content-container">
                {content}
            </div>
        </div>
    );
};

interface TenantOwedDisplayCellProps {
    name: string;
    amountOwed: string;
}

const TenantOwedDisplayCell: React.FC<TenantOwedDisplayCellProps> = ({ name, amountOwed }) => {
    return (
        <div className="tenant-owed-display-cell-container">
            <div className="tenant-owed-display-cell-inner">
                <div className="tenant-owed-display-cell-amount-container">
                    <div className="tenant-owed-display-cell-dollar-sign-container">
                        <i className="fa fa-usd" />
                    </div>
                    <div className="tenant-owed-display-cell-amount-container">
                        <span>{amountOwed}</span>
                    </div>
                </div>
                <div className="tenant-owed-display-cell-name-container">
                    <span>{name}</span>
                </div>
            </div>
        </div>
    );
};

interface TotalAmountOwedCellProps {
    amount: string;
}

const TotalAmountOwed: React.FC<TotalAmountOwedCellProps> = ({ amount }) => {
    return (
        <div className="total-amount-owed-container">
            <div className="total-amount-owed-text-container">
                <span>{'Total Amount: '}</span>
            </div>
            <div className="total-amount-owed-value-container">
                <div className="total-amount-owed-dollar-sign-container">
                    <i className="fa fa-usd" />
                </div>
                <div className="total-amont-owed-amount-container">
                    <span>{amount}</span>
                </div>
            </div>
        </div>
    );
};

export default AmountsWithPercentOwedDisplayCell;
