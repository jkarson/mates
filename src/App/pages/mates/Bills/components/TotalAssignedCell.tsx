import React from 'react';
import { roundToHundredth } from '../../../../common/utilities';

import '../styles/TotalAssignedCell.css';

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

export default TotalAssignedCell;
