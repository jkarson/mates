import React, { useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import RedMessageCell from '../../../../common/components/RedMessageCell';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { ApartmentId } from '../../../../common/models';
import { getPutOptions, getDeleteOptions } from '../../../../common/utilities';
import { ApartmentEvent } from '../models/EventsInfo';
import { EventsTabType } from '../models/EventsTabs';
import { initializeServerEventsInfo } from '../utilities';
import EventCell from './EventCell';

import '../styles/EventsComponent.css';

interface EventsComponentProps {
    displayEvents: ApartmentEvent[];
    tab: EventsTabType;
}

const EventsComponent: React.FC<EventsComponentProps> = ({ displayEvents, tab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    //const allEvents = user.apartment.eventsInfo.events;

    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage('');
    }, [tab]);

    const handleInvite = (event: ApartmentEvent, inviteeId: ApartmentId) => {
        const data = {
            apartmentId: user.apartment._id,
            eventId: event._id,
            inviteeId: inviteeId,
        };
        const options = getPutOptions(data);
        fetch('/mates/inviteFriendToEvent', options)
            .then((res) => res.json())
            .then((json) => {
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
                setMessage('Invitation Sent');
            });
    };

    const handleRemoveInvitee = (event: ApartmentEvent, inviteeId: ApartmentId) => {
        const data = { apartmentId: user.apartment._id, eventId: event._id, inviteeId: inviteeId };
        const options = getPutOptions(data);
        fetch('/mates/removeEventInvitation', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
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
                setMessage('Invitation removed');
            });
    };

    const handleRemoveAttendee = (event: ApartmentEvent, attendeeId: ApartmentId) => {
        const data = {
            apartmentId: user.apartment._id,
            eventId: event._id,
            attendeeId: attendeeId,
        };
        const options = getPutOptions(data);
        fetch('/mates/removeEventAttendee', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
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
                setMessage('Attendee removed from event');
            });
    };

    const handleLeaveEvent = (event: ApartmentEvent) => {
        const data = {
            apartmentId: user.apartment._id,
            eventId: event._id,
        };
        const options = getPutOptions(data);
        fetch('/mates/leaveEvent', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
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
                setMessage('You have left the event');
            });
    };

    const handleDeleteEvent = (event: ApartmentEvent) => {
        const data = { apartmentId: user.apartment._id, eventId: event._id };
        const options = getDeleteOptions(data);
        fetch('mates/deleteEvent', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
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
                setMessage('Event Deleted');
            });
    };

    const content = displayEvents.map((event) => (
        <EventCell
            event={event}
            hosting={event.hostApartmentId === user.apartment._id}
            canRemoveEvent={
                event.hostApartmentId === user.apartment._id && event.creatorId === user.userId
            }
            canRemoveFromEvent={event.hostApartmentId === user.apartment._id}
            handleRemoveEvent={handleDeleteEvent}
            handleInvite={handleInvite}
            handleRemoveAttendee={handleRemoveAttendee}
            handleRemoveInvitee={handleRemoveInvitee}
            handleLeaveEvent={handleLeaveEvent}
        />
    ));

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="events-component-container">
            <div className="events-component-error-container">
                {message.length === 0 ? null : <RedMessageCell message={message} />}
            </div>
            <div className="events-component-content-container">{content}</div>
        </div>
    );
};

export default EventsComponent;
