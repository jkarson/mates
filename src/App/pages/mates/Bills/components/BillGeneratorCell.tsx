import React, { useContext } from 'react';
import { UserContext, UserContextType } from '../../../../common/context';
import { getFormattedDateString, getTenantByTenantId } from '../../../../common/utilities';
import { AmountWithPercentOwed } from '../models/AmountWithPercentOwed';
import { BillGenerator, BillGeneratorID } from '../models/BillGenerator';
import { getTotalAssignedValue } from '../utilities';

interface BillGeneratorCellProps {
    billGenerator: BillGenerator;
    handleDeleteBillSeries: (bgId: BillGeneratorID) => void;
}

const BillGeneratorCell: React.FC<BillGeneratorCellProps> = ({
    billGenerator,
    handleDeleteBillSeries,
}) => {
    return (
        <div style={{ borderBottom: '1px solid black' }}>
            <span style={billGenerator.isPrivate ? { color: 'red' } : {}}>
                <p style={{ fontWeight: 'bold' }}>{billGenerator.name}</p>
                <p>
                    <u>{'Payable to:'}</u>
                    {' ' + billGenerator.payableTo}
                </p>
                <p>
                    {billGenerator.frequency +
                        ', beginning ' +
                        getFormattedDateString(billGenerator.starting)}
                </p>
                <AmountsWithPercentOwedDisplayCell
                    amountsWithPercentOwed={billGenerator.amountsWithPercentOwed}
                />
            </span>
            <button onClick={() => handleDeleteBillSeries(billGenerator.id)}>
                {'Delete Bill Series'}
            </button>
        </div>
    );
};

interface AmountsWithPercentOwedDisplayCellProps {
    amountsWithPercentOwed: AmountWithPercentOwed[];
}

const AmountsWithPercentOwedDisplayCell: React.FC<AmountsWithPercentOwedDisplayCellProps> = ({
    amountsWithPercentOwed,
}) => {
    const { user } = useContext(UserContext) as UserContextType;
    const content = amountsWithPercentOwed
        .filter((aWPO) => aWPO.percentValue > 0)
        .map((aWPO) => {
            const tenant = getTenantByTenantId(user, aWPO.tenantId);
            const tenantName = tenant ? tenant.name : 'Unknown';
            return <p>{tenantName + ': $' + aWPO.amount + ' (' + aWPO.percent + '%)'}</p>;
        });
    const header =
        content.length > 1 ? (
            <h3>{'Total Amount Owed: $' + getTotalAssignedValue(amountsWithPercentOwed)}</h3>
        ) : (
            <h3>{'Amount Owed:'}</h3>
        );

    return (
        <div>
            {header}
            {content}
        </div>
    );
};

export default BillGeneratorCell;
