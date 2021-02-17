import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { ApartmentId } from '../../../../common/models';
import { getPutOptions, getDeleteOptions } from '../../../../common/utilities';
import { ApartmentEvent } from '../models/EventsInfo';
import { EventsTabType } from '../models/EventsTabs';
import { initializeServerEventsInfo } from '../utilities';
import EventCell from './EventCell';
import StandardStyledText from '../../../../common/components/StandardStyledText';
import { RedMessageCell } from '../../../../common/components/ColoredMessageCells';

import '../styles/EventsComponent.css';

interface EventsComponentProps {
    displayEvents: ApartmentEvent[];
    tab: EventsTabType;
}

const EventsComponent: React.FC<EventsComponentProps> = ({ displayEvents, tab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState('');
    const [serverCallMade, setServerCallMade] = useState(false);

    useEffect(() => {
        if (message !== 'Sorry, our server seems to be down.') {
            setMessage('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    const handleInvite = (event: ApartmentEvent, inviteeId: ApartmentId) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = {
            apartmentId: user.apartment._id,
            eventId: event._id,
            inviteeId: inviteeId,
        };
        const options = getPutOptions(data);
        fetch('/mates/inviteFriendToEvent', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, your friend could not be invited to the event at this time');
                    return;
                }
                const { eventsInfo } = json;
                const formattedEventsInfo = initializeServerEventsInfo(eventsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, eventsInfo: formattedEventsInfo },
                });
                setMessage('Invitation sent.');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const handleRemoveInvitee = (event: ApartmentEvent, inviteeId: ApartmentId) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = { apartmentId: user.apartment._id, eventId: event._id, inviteeId: inviteeId };
        const options = getPutOptions(data);
        fetch('/mates/removeEventInvitation', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, your invitation could not be removed at this time');
                    return;
                }
                const { eventsInfo } = json;
                const formattedEventsInfo = initializeServerEventsInfo(eventsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, eventsInfo: formattedEventsInfo },
                });
                setMessage('Invitation removed.');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const handleRemoveAttendee = (event: ApartmentEvent, attendeeId: ApartmentId) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = {
            apartmentId: user.apartment._id,
            eventId: event._id,
            attendeeId: attendeeId,
        };
        const options = getPutOptions(data);
        fetch('/mates/removeEventAttendee', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, your invitation could not be removed at this time');
                    return;
                }
                const { eventsInfo } = json;
                const formattedEventsInfo = initializeServerEventsInfo(eventsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, eventsInfo: formattedEventsInfo },
                });
                setMessage('Attendee removed from event.');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const handleLeaveEvent = (event: ApartmentEvent) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = {
            apartmentId: user.apartment._id,
            eventId: event._id,
        };
        const options = getPutOptions(data);
        fetch('/mates/leaveEvent', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, you are unable to leave this event at this time');
                    return;
                }
                const { eventsInfo } = json;
                const formattedEventsInfo = initializeServerEventsInfo(eventsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, eventsInfo: formattedEventsInfo },
                });
                setMessage('You have left the event.');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const handleDeleteEvent = (event: ApartmentEvent) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = { apartmentId: user.apartment._id, eventId: event._id };
        const options = getDeleteOptions(data);
        fetch('mates/deleteEvent', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, the event could not be deleted at this time');
                    return;
                }
                const { eventsInfo } = json;
                const formattedEventsInfo = initializeServerEventsInfo(eventsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, eventsInfo: formattedEventsInfo },
                });
                setMessage('Event deleted.');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
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

    if (redirect) {
        return <Redirect to="/" />;
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

export default EventsComponent;
