import React from 'react';
import { getFormattedDateTimeString } from '../../Common/utilities';
import { ApartmentEvent } from '../models/ApartmentEvent';

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
        <div>
            <p style={{ fontWeight: 'bold' }}>{invitation.title}</p>
            <h5>{getFormattedDateTimeString(invitation.time)}</h5>
            <p>{'Created by ' + invitation.creator}</p>
            <button onClick={() => handleAccept(invitation)}>{'Accept Invitation'}</button>
            <button onClick={() => handleDelete(invitation)}>{'Delete Invitation'}</button>
        </div>
    );
};

export default InvitationCell;
