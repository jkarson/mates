import React, { useContext } from 'react';
import StandardStyledText from '../../../../common/components/StandardStyledText';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { ApartmentId } from '../../../../common/models';
import { ApartmentEvent } from '../models/EventsInfo';
import EligibleInviteeCell from './EligibleInviteeCell';

import '../styles/SendInvitationCell.css';

interface SendInvitationCellProps {
    event: ApartmentEvent;
    handleInvite: (event: ApartmentEvent, invitee: ApartmentId) => void;
}

const SendInvitationCell: React.FC<SendInvitationCellProps> = ({ event, handleInvite }) => {
    const { matesUser } = useContext(MatesUserContext) as MatesUserContextType;
    const friends = matesUser.apartment.friendsInfo.friends;
    const eligibleInvitees = friends.filter((apartment) => {
        const apartmentId = apartment.apartmentId;
        const attendeeIds = event.attendees.map((attendee) => attendee.apartmentId);
        const inviteeIds = event.invitees.map((invitee) => invitee.apartmentId);
        return !attendeeIds.includes(apartmentId) && !inviteeIds.includes(apartmentId);
    });
    const eligibleInviteeCells = eligibleInvitees.map((apartment) => (
        <EligibleInviteeCell
            apartment={apartment}
            handleClickInvite={() => handleInvite(event, apartment.apartmentId)}
        />
    ));
    return (
        <div className="send-invitation-cell-container">
            <div className="send-invitation-cell-message-container">
                {eligibleInvitees.length === 0 ? (
                    <StandardStyledText
                        text={'No friends are eligible to be invited to this event'}
                    />
                ) : null}
            </div>
            <div className="send-invitation-cell-eligible-invitees-container">
                {eligibleInviteeCells}
            </div>
        </div>
    );
};

export default SendInvitationCell;
