import React, { useContext, useState } from 'react';
import { UserContext, UserContextType } from '../../../../common/context';
import { Apartment } from '../../../../common/models';
import {
    getFormattedDateTimeString,
    getApartmentSummaryString,
} from '../../../../common/utilities';
import FriendSummaryCell from '../../Friends/components/FriendSummaryCell';
import { ApartmentEvent } from '../models/ApartmentEvent';
import { isFutureEvent, isPresentEvent } from '../utilities';

interface EventCellProps {
    event: ApartmentEvent;
    hosting: boolean;
    canRemoveEvent: boolean;
    handleRemoveEvent: (event: ApartmentEvent) => void;
    handleInvite: (event: ApartmentEvent, invitee: Apartment) => void;
    handleRemoveInvitee: (event: ApartmentEvent, invitee: Apartment) => void;
    handleRemoveAttendee: (event: ApartmentEvent, attendee: Apartment) => void;
}

const EventCell: React.FC<EventCellProps> = ({
    event,
    hosting,
    canRemoveEvent,
    handleRemoveEvent,
    handleInvite,
    handleRemoveInvitee,
    handleRemoveAttendee,
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
                apartments={event.invitees}
                isInviteesCell={true}
                handleDelete={handleRemoveInvitee}
                event={event}
            />
            <AttendeesInviteesCell
                apartments={event.attendees}
                isInviteesCell={false}
                handleDelete={handleRemoveAttendee}
                event={event}
            />
            {!hosting ? (
                <button onClick={() => handleRemoveEvent(event)}>{'Leave Event'}</button>
            ) : null}
        </div>
    );
};

interface SendInvitationCellProps {
    event: ApartmentEvent;
    handleInvite: (event: ApartmentEvent, invitee: Apartment) => void;
}

const SendInvitationCell: React.FC<SendInvitationCellProps> = ({ event, handleInvite }) => {
    const { user } = useContext(UserContext) as UserContextType;
    const friends = user.apartment.friendsInfo.friends;
    const eligibleInvitees = friends.filter(
        (apartment) => !event.attendees.includes(apartment) && !event.invitees.includes(apartment),
    );
    return (
        <div>
            {eligibleInvitees.length === 0 ? (
                <p>{'No friends are eligible to be invited to this event'}</p>
            ) : (
                eligibleInvitees.map((apartment, index) => (
                    <div>
                        <p>{getApartmentSummaryString(apartment)}</p>
                        <button onClick={() => handleInvite(event, apartment)}>{'Invite'}</button>
                    </div>
                ))
            )}
        </div>
    );
};

interface AttendeesInviteesCellProps {
    event: ApartmentEvent;
    apartments: Apartment[];
    isInviteesCell: boolean;
    handleDelete: (event: ApartmentEvent, apartment: Apartment) => void;
}

const AttendeesInviteesCell: React.FC<AttendeesInviteesCellProps> = ({
    event,
    apartments,
    isInviteesCell,
    handleDelete,
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
                            <FriendSummaryCell friend={apartment} />
                            <button onClick={() => handleDelete(event, apartment)}>
                                {'Remove from event'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventCell;
