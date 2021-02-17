import React from 'react';
import StandardStyledText from '../../../../common/components/StandardStyledText';
import { ApartmentId } from '../../../../common/models';
import { ApartmentSummary } from '../../Friends/models/FriendsInfo';
import { ApartmentEvent } from '../models/EventsInfo';
import AttendeeInviteeCell from './AttendeeInviteeCell';

import '../styles/AttendeesInviteesCell.css';

interface AttendeesInviteesCellProps {
    canRemoveFromEvent: boolean;
    event: ApartmentEvent;
    apartments: ApartmentSummary[];
    isInviteesCell: boolean;
    handleDelete: (event: ApartmentEvent, apartmentId: ApartmentId) => void;
}

const AttendeesInviteesCell: React.FC<AttendeesInviteesCellProps> = ({
    event,
    apartments,
    isInviteesCell,
    handleDelete,
    canRemoveFromEvent,
}) => {
    const attendeeInviteeCells = apartments.map((apartment) => (
        <AttendeeInviteeCell
            apartment={apartment}
            handleClickDelete={() => handleDelete(event, apartment.apartmentId)}
            canRemoveFromEvent={canRemoveFromEvent}
            key={apartment.apartmentId}
        />
    ));

    return (
        <div className="attendees-invitees-cell-container">
            <div className="attendees-invitees-cell-message-container">
                {apartments.length === 0 ? (
                    <StandardStyledText
                        text={
                            'No other apartments are ' +
                            (isInviteesCell ? 'invited to' : 'attending') +
                            ' this event.'
                        }
                    />
                ) : (
                    <StandardStyledText text={isInviteesCell ? 'Invited: ' : 'Attending: '} />
                )}
            </div>
            <div className="attendees-invitees-cell-content-container">{attendeeInviteeCells}</div>
        </div>
    );
};

export default AttendeesInviteesCell;
