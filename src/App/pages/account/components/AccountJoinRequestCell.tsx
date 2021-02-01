import React from 'react';
import SimpleButton from '../../../common/components/SimpleButton';
import ApartmentSummaryCell from '../../mates/Friends/components/ApartmentSummaryCell';
import { ApartmentSummary } from '../../mates/Friends/models/FriendsInfo';

import '../styles/AccountJoinRequestCell.css';

interface AccountJoinRequestCellProps {
    apartmentSummary: ApartmentSummary;
    cancelJoinRequest: (apartment: ApartmentSummary) => void;
}

const AccountJoinRequestCell: React.FC<AccountJoinRequestCellProps> = ({
    apartmentSummary,
    cancelJoinRequest,
}) => (
    <div className="account-join-request-cell-container">
        <div className="account-join-request-cell-summary-container">
            <ApartmentSummaryCell friend={apartmentSummary} />
        </div>
        <div className="account-join-request-cell-button-container">
            <SimpleButton
                onClick={() => cancelJoinRequest(apartmentSummary)}
                text={'Cancel Join Request'}
            />
        </div>
    </div>
);

export default AccountJoinRequestCell;
