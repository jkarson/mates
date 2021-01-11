import React from 'react';
import { Apartment, ApartmentSummary, FriendProfile } from '../../../../common/models';
import { formatNames } from '../../../../common/utilities';

//TO DO: Clean this up! why does the Friend Profile have
//all these attributes if the FPSC doesn't display them?
//i understand it's a legacy issue, clean it up

interface FriendProfileSummaryCellProps {
    friend: FriendProfile;
}

const FriendProfileSummaryCell: React.FC<FriendProfileSummaryCellProps> = ({ friend }) => (
    <p>
        <span style={{ fontWeight: 'bold' }}>{friend.name + ': '}</span>
        {formatNames(friend.tenants.map((tenant) => tenant.name))}
    </p>
);

interface ApartmentSummaryCellProps {
    friend: ApartmentSummary;
}

const ApartmentSummaryCell: React.FC<ApartmentSummaryCellProps> = ({ friend }) => (
    <p>
        <span style={{ fontWeight: 'bold' }}>{friend.name + ': '}</span>
        {formatNames(friend.tenantNames)}
    </p>
);
export default FriendProfileSummaryCell;
export { ApartmentSummaryCell };
