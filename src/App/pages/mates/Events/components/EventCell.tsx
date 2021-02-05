import React, { useState } from 'react';
import SimpleButton from '../../../../common/components/SimpleButton';
import { ApartmentId } from '../../../../common/models';
import { getFormattedDateTimeString } from '../../../../common/utilities';
import { ApartmentEvent } from '../models/EventsInfo';
import { isFutureEvent, isPresentEvent } from '../utilities';
import AttendeesInviteesCell from './AttendeesInviteesCell';
import SendInvitationCell from './SendInvitationCell';

import '../styles/EventCell.css';

interface EventCellProps {
    event: ApartmentEvent;
    hosting: boolean;
    canRemoveEvent: boolean;
    canRemoveFromEvent: boolean;
    handleRemoveEvent: (event: ApartmentEvent) => void;
    handleInvite: (event: ApartmentEvent, invitee: ApartmentId) => void;
    handleRemoveInvitee: (event: ApartmentEvent, invitee: ApartmentId) => void;
    handleRemoveAttendee: (event: ApartmentEvent, attendee: ApartmentId) => void;
    handleLeaveEvent: (event: ApartmentEvent) => void;
}

const EventCell: React.FC<EventCellProps> = ({
    event,
    hosting,
    canRemoveEvent,
    canRemoveFromEvent,
    handleRemoveEvent,
    handleInvite,
    handleRemoveInvitee,
    handleRemoveAttendee,
    handleLeaveEvent,
}) => {
    const [showInviteCell, setShowInviteCell] = useState(false);
    const presentOrFuture = isFutureEvent(event) || isPresentEvent(event);
    return (
        <div className="event-cell-container">
            <div className="event-cell-delete-button-container">
                {canRemoveEvent ? (
                    <SimpleButton onClick={() => handleRemoveEvent(event)} text={'Delete Event'} />
                ) : null}
            </div>
            <div className="event-cell-event-description-container">
                <div
                    className={
                        hosting
                            ? 'event-cell-event-title-hosting-container'
                            : 'event-cell-event-title-not-hosting-container'
                    }
                >
                    <span>{event.title}</span>
                </div>
                <span>{getFormattedDateTimeString(event.time)}</span>
                <span>{'Created by ' + event.creator}</span>
                {event.description ? <span>{'Description: ' + event.description}</span> : null}
            </div>
            <div className="event-cell-show-invite-cell-button-container">
                {presentOrFuture && hosting ? (
                    <SimpleButton
                        onClick={() => setShowInviteCell(!showInviteCell)}
                        text={showInviteCell ? 'Cancel' : 'Invite Other Apartments'}
                    />
                ) : null}
            </div>
            <div className="event-cell-send-invitation-cell-container">
                {showInviteCell ? (
                    <SendInvitationCell event={event} handleInvite={handleInvite} />
                ) : null}
            </div>
            <div className="event-cell-invitees-cell-container">
                <AttendeesInviteesCell
                    canRemoveFromEvent={canRemoveFromEvent}
                    apartments={event.invitees}
                    isInviteesCell={true}
                    handleDelete={handleRemoveInvitee}
                    event={event}
                />
            </div>
            <div className="event-cell-attendees-cell-container">
                <AttendeesInviteesCell
                    canRemoveFromEvent={canRemoveFromEvent}
                    apartments={event.attendees}
                    isInviteesCell={false}
                    handleDelete={handleRemoveAttendee}
                    event={event}
                />
            </div>
            <div className="event-cell-leave-event-button-container">
                {!hosting ? (
                    <SimpleButton onClick={() => handleLeaveEvent(event)} text={'Leave Event'} />
                ) : null}
            </div>
        </div>
    );
};

export default EventCell;
