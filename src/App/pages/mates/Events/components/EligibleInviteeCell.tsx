import React from 'react';
import { SimpleButton } from '../../../../common/components/SimpleButtons';
import { assertUnreachable } from '../../../../common/utilities';
import ApartmentSummaryCell from '../../Friends/components/ApartmentSummaryCell';
import { ApartmentSummary } from '../../Friends/models/FriendsInfo';

import '../styles/EligibleInviteeCell.css';

interface EligibleInviteeCellProps {
    apartment: ApartmentSummary;
    canRemove: boolean;
    handleClickInvite: () => void;
    handleClickUninvite: () => void;
    handleClickRemoveAttendee: () => void;
    mode: 'Invite' | 'Invitees' | 'Attendees';
}

const EligibleInviteeCell: React.FC<EligibleInviteeCellProps> = ({
    apartment,
    canRemove,
    handleClickInvite,
    handleClickUninvite,
    handleClickRemoveAttendee,
    mode,
}) => {
    let button: JSX.Element;
    switch (mode) {
        case 'Invite':
            button = <SimpleButton onClick={handleClickInvite} text={'Invite'} />;
            break;
        case 'Invitees':
            button = (
                <div className="eligible-invitee-cell-uninvite-button-container">
                    <SimpleButton onClick={handleClickUninvite} text={'Uninvite'} />
                </div>
            );
            break;
        case 'Attendees':
            button = (
                <div className="eligible-invitee-cell-remove-attendee-button-container">
                    <SimpleButton onClick={handleClickRemoveAttendee} text="Remove From Event" />
                </div>
            );
            break;
        default:
            assertUnreachable(mode);
    }
    return (
        <div className="eligible-invitee-cell-container">
            <div className="eligible-invitee-cell-summary-container">
                <ApartmentSummaryCell friend={apartment} />
            </div>
            {canRemove ? (
                <div className="eligible-invitee-cell-button-container">{button}</div>
            ) : null}
        </div>
    );
};

export default EligibleInviteeCell;
