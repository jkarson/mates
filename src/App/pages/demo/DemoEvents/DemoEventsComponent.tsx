import React, { useContext, useState, useEffect } from 'react';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import StandardStyledText from '../../../common/components/StandardStyledText';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { ApartmentId } from '../../../common/models';
import { getApartmentSummaryFromFriendProfile } from '../../../common/utilities';
import EventCell from '../../mates/Events/components/EventCell';
import { ApartmentEvent } from '../../mates/Events/models/EventsInfo';
import { EventsTabType } from '../../mates/Events/models/EventsTabs';

interface DemoEventsComponentProps {
    displayEvents: ApartmentEvent[];
    tab: EventsTabType;
}

const DemoEventsComponent: React.FC<DemoEventsComponentProps> = ({ displayEvents, tab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage('');
    }, [tab]);

    const handleInvite = (event: ApartmentEvent, inviteeId: ApartmentId) => {
        const friend = user.apartment.friendsInfo.friends.find(
            (friend) => friend.apartmentId === inviteeId,
        );
        if (!friend) {
            return;
        }
        event.invitees.push(getApartmentSummaryFromFriendProfile(friend));
        setUser({ ...user });
        setMessage('Invitation Sent');
    };

    const handleRemoveInvitee = (event: ApartmentEvent, inviteeId: ApartmentId) => {
        const inviteeIndex = event.invitees.findIndex(
            (invitee) => invitee.apartmentId === inviteeId,
        );
        if (inviteeIndex !== -1) {
            event.invitees.splice(inviteeIndex, 1);
            setUser({ ...user });
            setMessage('Invitation removed');
        }
    };

    const handleRemoveAttendee = (event: ApartmentEvent, attendeeId: ApartmentId) => {
        const attendeeIndex = event.attendees.findIndex(
            (attendee) => attendee.apartmentId === attendeeId,
        );
        if (attendeeIndex !== -1) {
            event.attendees.splice(attendeeIndex, 1);
            setUser({ ...user });
            setMessage('Attendee removed from event');
        }
    };

    const handleLeaveEvent = (event: ApartmentEvent) => {
        const apartmentIndex = event.attendees.findIndex(
            (apartment) => apartment.apartmentId === user.apartment._id,
        );
        if (apartmentIndex !== -1) {
            event.attendees.splice(apartmentIndex, 1);
        }
        const eventIndex = user.apartment.eventsInfo.events.findIndex(
            (apartmentEvent) => apartmentEvent._id === event._id,
        );
        if (eventIndex !== -1) {
            user.apartment.eventsInfo.events.splice(eventIndex, 1);
            setUser({ ...user });
            setMessage('You have left the event.');
        }
    };

    const handleDeleteEvent = (event: ApartmentEvent) => {
        const eventIndex = user.apartment.eventsInfo.events.findIndex(
            (apartmentEvent) => apartmentEvent._id === event._id,
        );
        if (eventIndex !== -1) {
            user.apartment.eventsInfo.events.splice(eventIndex, 1);
            setUser({ ...user });
            setMessage('Event deleted.');
        }
    };

    const areApartmentsToInvite = (event: ApartmentEvent) => {
        const uninvitedFriends = user.apartment.friendsInfo.friends.filter((apartment) => {
            const apartmentId = apartment.apartmentId;
            const attendeeIds = event.attendees.map((attendee) => attendee.apartmentId);
            const inviteeIds = event.invitees.map((invitee) => invitee.apartmentId);
            return !attendeeIds.includes(apartmentId) && !inviteeIds.includes(apartmentId);
        });
        return uninvitedFriends.length > 0;
    };

    const content = displayEvents.map((event) => (
        <EventCell
            event={event}
            hosting={event.hostApartmentId === user.apartment._id}
            canRemoveEvent={
                event.hostApartmentId === user.apartment._id && event.creatorId === user.userId
            }
            areApartmentsToInvite={areApartmentsToInvite(event)}
            canRemoveFromEvent={event.hostApartmentId === user.apartment._id}
            handleRemoveEvent={handleDeleteEvent}
            handleInvite={handleInvite}
            handleRemoveAttendee={handleRemoveAttendee}
            handleRemoveInvitee={handleRemoveInvitee}
            handleLeaveEvent={handleLeaveEvent}
            setMessage={setMessage}
            key={event._id}
        />
    ));

    let eventsDescription: string;
    switch (tab) {
        case 'Past':
            eventsDescription =
                'A list of all events more than 24 hours in the past. Other apartments cannot be invited to these events, but enjoy your trip down memory lane.';
            break;
        case 'Present':
            eventsDescription = 'A list of all events within 24 hours of now.';
            break;
        case 'Future':
            eventsDescription = 'A list of all events more than 24 hours in the future.';
            break;
        default:
            eventsDescription = '';
    }

    return (
        <div className="events-component-container">
            <div className="events-component-description-container">
                <StandardStyledText text={eventsDescription} />
            </div>
            <div className="events-component-error-container">
                {message.length === 0 ? null : <RedMessageCell message={message} />}
            </div>
            <div className="events-component-content-container">{content}</div>
        </div>
    );
};

export default DemoEventsComponent;
