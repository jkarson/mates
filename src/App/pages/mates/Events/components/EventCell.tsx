import React, { useContext, useState } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { ApartmentId } from '../../../../common/models';
import {
    getFormattedDateTimeString,
    getFriendProfileSummaryString,
} from '../../../../common/utilities';
import ApartmentSummaryCell from '../../Friends/components/ApartmentSummaryCell';
import { ApartmentSummary } from '../../Friends/models/FriendsInfo';
import { ApartmentEvent } from '../models/EventsInfo';
import { isFutureEvent, isPresentEvent } from '../utilities';

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
        <div style={{ borderTop: '1px solid black' }}>
            {canRemoveEvent ? (
                <button onClick={() => handleRemoveEvent(event)}>{'DELETE EVENT'}</button>
            ) : null}
            <p
                style={
                    hosting
                        ? { fontWeight: 'bold', color: 'red' }
                        : { fontWeight: 'bold', color: 'blue' }
                }
            >
                {event.title}
            </p>
            <h5>{getFormattedDateTimeString(event.time)}</h5>
            <p>{'Created by ' + event.creator}</p>
            <p>{event.description ? 'Description: ' + event.description : null}</p>
            {presentOrFuture && hosting ? (
                <button onClick={() => setShowInviteCell(!showInviteCell)}>
                    {showInviteCell ? 'Cancel' : 'Invite Other Apartments'}
                </button>
            ) : null}
            {showInviteCell ? (
                <SendInvitationCell event={event} handleInvite={handleInvite} />
            ) : null}
            <AttendeesInviteesCell
                canRemoveFromEvent={canRemoveFromEvent}
                apartments={event.invitees}
                isInviteesCell={true}
                handleDelete={handleRemoveInvitee}
                event={event}
            />
            <AttendeesInviteesCell
                canRemoveFromEvent={canRemoveFromEvent}
                apartments={event.attendees}
                isInviteesCell={false}
                handleDelete={handleRemoveAttendee}
                event={event}
            />
            {!hosting ? (
                <button onClick={() => handleLeaveEvent(event)}>{'Leave Event'}</button>
            ) : null}
        </div>
    );
};

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
    return (
        <div>
            {eligibleInvitees.length === 0 ? (
                <p>{'No friends are eligible to be invited to this event'}</p>
            ) : (
                eligibleInvitees.map((apartment, index) => (
                    <div>
                        <p>{getFriendProfileSummaryString(apartment)}</p>
                        <button onClick={() => handleInvite(event, apartment.apartmentId)}>
                            {'Invite'}
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

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
    return (
        <div>
            {apartments.length <= 0 ? (
                <p>
                    {'No other apartments are ' +
                        (isInviteesCell ? 'invited to' : 'attending') +
                        ' this event.'}
                </p>
            ) : (
                <div>
                    <p>{isInviteesCell ? 'Invited: ' : 'Attending: '}</p>
                    {apartments.map((apartment) => (
                        <div>
                            <ApartmentSummaryCell friend={apartment} />
                            {!canRemoveFromEvent ? null : (
                                <button onClick={() => handleDelete(event, apartment.apartmentId)}>
                                    {'Remove from event'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventCell;
