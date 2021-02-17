import React from 'react';
import { SimpleButton } from '../../../../common/components/SimpleButtons';
import ApartmentSummaryCell from '../../Friends/components/ApartmentSummaryCell';
import { ApartmentSummary } from '../../Friends/models/FriendsInfo';

import '../styles/AttendeeInviteeCell.css';

interface AttendeeInviteeCellProps {
    apartment: ApartmentSummary;
    handleClickDelete: () => void;
    canRemoveFromEvent: boolean;
}

const AttendeeInviteeCell: React.FC<AttendeeInviteeCellProps> = ({
    apartment,
    handleClickDelete,
    canRemoveFromEvent,
}) => (
    <div className="attendee-invitee-cell-container">
        <div className="attendee-invitee-cell-summary-container">
            <ApartmentSummaryCell friend={apartment} />
        </div>
        <div className="attendee-invitee-cell-button-container">
            {!canRemoveFromEvent ? null : (
                <SimpleButton onClick={handleClickDelete} text={'Remove From Event'} />
            )}
        </div>
    </div>
);

export default AttendeeInviteeCell;
