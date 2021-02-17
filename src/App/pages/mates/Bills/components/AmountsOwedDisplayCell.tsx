import React, { useContext } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { UserId } from '../../../../common/models';
import { getTenantByTenantId } from '../../../../common/utilities';
import { AmountOwed } from '../models/AmountOwed';
import AmountOwedDisplayCell from './AmountOwedDisplayCell';
import { SimpleButton } from '../../../../common/components/SimpleButtons';

import '../styles/AmountsOwedDisplayCell.css';

interface AmountsOwedDisplayCellProps {
    amountsOwed: AmountOwed[];
    includesUser: boolean;
    userPortionIsPaid: boolean;
    handlePayPortionToTenant: (payeeId: UserId) => void;
}

const AmountsOwedDisplayCell: React.FC<AmountsOwedDisplayCellProps> = ({
    amountsOwed,
    includesUser,
    userPortionIsPaid,
    handlePayPortionToTenant,
}) => {
    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    const content = amountsOwed.map((amountOwed) => {
        const { userId: tenantId, currentAmount, initialAmount } = amountOwed;
        const tenant = getTenantByTenantId(user, tenantId);
        const tenantName = tenant === undefined ? 'Unknown' : tenant.name;

        return (
            <div className="amounts-owed-display-cell-tenant-container" key={amountOwed.userId}>
                <div className="amounts-owed-display-cell-amount-owed-container">
                    <AmountOwedDisplayCell
                        name={tenantName}
                        currentAmount={currentAmount}
                        initialAmount={initialAmount}
                    />
                </div>
                <div className="amounts-owed-display-cell-button-container">
                    {!includesUser ||
                    userPortionIsPaid ||
                    amountOwed.userId === user.userId ? null : (
                        <SimpleButton
                            onClick={() => {
                                handlePayPortionToTenant(tenantId);
                            }}
                            text="Pay Portion"
                        />
                    )}
                </div>
            </div>
        );
    });
    return <div>{content}</div>;
};

export default AmountsOwedDisplayCell;
