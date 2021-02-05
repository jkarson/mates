import React from 'react';
import SimpleButton from '../../../../common/components/SimpleButton';
import { getFriendProfileSummaryString } from '../../../../common/utilities';
import { FriendProfile } from '../../Friends/models/FriendsInfo';

import '../styles/EligibleInviteeCell.css';

interface EligibleInviteeCellProps {
    apartment: FriendProfile;
    handleClickInvite: () => void;
}

const EligibleInviteeCell: React.FC<EligibleInviteeCellProps> = ({
    apartment,
    handleClickInvite,
}) => (
    <div className="eligible-invitee-cell-container">
        <div className="eligible-invitee-cell-summary-container">
            <span>{getFriendProfileSummaryString(apartment)}</span>
        </div>
        <div className="eligible-invitee-cell-button-container">
            <SimpleButton onClick={handleClickInvite} text={'Invite'} />
        </div>
    </div>
);

export default EligibleInviteeCell;
