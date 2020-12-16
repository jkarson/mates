import React from 'react';
import { Apartment } from '../../../../common/models';
import { formatNames } from '../../../../common/utilities';

interface FriendSummaryCellProps {
    friend: Apartment;
}

const FriendSummaryCell: React.FC<FriendSummaryCellProps> = ({ friend }) => (
    <p>
        <span style={{ fontWeight: 'bold' }}>{friend.name + ': '}</span>
        {formatNames(friend.tenants.map((tenant) => tenant.name))}
    </p>
);

export default FriendSummaryCell;
