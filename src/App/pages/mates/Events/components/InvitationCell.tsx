import React from 'react';
import { SimpleButton } from '../../../../common/components/SimpleButtons';
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
            <div className="invitation-cell-info-container">
                <div className="invitation-cell-title-container">
                    <span>{invitation.title}</span>
                </div>
                <div className="invitation-cell-date-container">
                    <span>{getFormattedDateTimeString(invitation.time)}</span>
                </div>
                <div className="invitation-cell-host-container">
                    <span>{'Hosted by '}</span>
                    <i className="fa fa-home" />
                    <span>{invitation.creator}</span>
                </div>
            </div>
            <div className="invitation-cell-accept-button-container">
                <SimpleButton
                    onClick={() => {
                        handleAccept(invitation);
                    }}
                    text={'Accept Invitation'}
                />
            </div>
            <div className="invitation-cell-reject-button-container">
                <SimpleButton
                    onClick={() => {
                        handleDelete(invitation);
                    }}
                    text={'Reject Invitation'}
                />
            </div>
        </div>
    );
};

export default InvitationCell;
