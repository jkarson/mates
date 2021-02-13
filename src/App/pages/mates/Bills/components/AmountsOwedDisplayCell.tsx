import React, { useContext } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { UserId } from '../../../../common/models';
import { getTenantByTenantId } from '../../../../common/utilities';
import { AmountOwed } from '../models/AmountOwed';
import AmountOwedDisplayCell from './AmountOwedDisplayCell';

import '../styles/AmountsOwedDisplayCell.css';
import SimpleButton from '../../../../common/components/SimpleButton';

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
        } else {
            return (
                <div className="amounts-owed-display-cell-tenant-container">
                    <div className="amounts-owed-display-cell-amount-owed-container">
                        <AmountOwedDisplayCell
                            name={tenant.name}
                            currentAmount={currentAmount}
                            initialAmount={initialAmount}
                        />
                    </div>
                    <div className="amounts-owed-display-cell-button-container">
                        {userPortionIsPaid || amountOwed.userId === user.userId ? null : (
                            <SimpleButton
                                onClick={() => handlePayPortionToTenant(tenant.userId)}
                                text="Pay Portion"
                            />
                        )}
                    </div>
                </div>
            );
        }
    });
    return <div>{content}</div>;
};

export default AmountsOwedDisplayCell;
