import React from 'react';
import SimpleButton from '../../../../common/components/SimpleButton';
import { getFormattedDateTimeString } from '../../../../common/utilities';
import { ApartmentEvent } from '../models/EventsInfo';

import '../styles/InvitationCell.css';

interface InvitationCellProps {
    invitation: ApartmentEvent;
    handleAccept: (invitation: ApartmentEvent) => void;
    handleDelete: (invitation: ApartmentEvent) => void;
}

const InvitationCell: React.FC<InvitationCellProps> = ({
    invitation,
    handleAccept,
    handleDelete,
}) => {
    return (
        <div className="invitation-cell-container">
            <span>{invitation.title}</span>
            <span>{getFormattedDateTimeString(invitation.time)}</span>
            <span>{'Created by ' + invitation.creator}</span>
            <SimpleButton onClick={() => handleAccept(invitation)} text={'Accept Invitation'} />
            <SimpleButton onClick={() => handleDelete(invitation)} text={'Reject Invitation'} />
        </div>
    );
};

export default InvitationCell;
