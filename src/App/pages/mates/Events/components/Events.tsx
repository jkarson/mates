import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { eventsTabNames, EventsTabType } from '../models/EventsTabs';
import CreateEventCell from './CreateEventCell';
import {
    initializeServerEventsInfo,
    isFutureEvent,
    isPastEvent,
    isPresentEvent,
} from '../utilities';
import EventCell from './EventCell';
import InvitationCell from './InvitationCell';
import DescriptionCell from '../../../../common/components/DescriptionCell';
import Tabs from '../../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { ApartmentId } from '../../../../common/models';
import { assertUnreachable, getDeleteOptions, getPutOptions } from '../../../../common/utilities';
import { Redirect } from 'react-router-dom';
import { ApartmentEvent } from '../models/EventsInfo';

//EXTENSION: Guarantee that events move from past to present and to future
//in real time at the 24 hour mark

const Events: React.FC = () => {
    const [tab, setTab] = useState<EventsTabType>('Present');

    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    const events = user.apartment.eventsInfo.events;

    useLayoutEffect(() => {
        if (user.apartment.eventsInfo.invitations.length > 0) {
            setTab('Event Invitations');
            return;
        }
        if (getPresentEvents().length > 0) {
            setTab('Present');
            return;
        }
        if (getFutureEvents().length > 0) {
            setTab('Future');
            return;
        }
        setTab('Create New Event');
    }, []);

    const getFutureEvents = () =>
        events
            .filter((event) => isFutureEvent(event))
            .sort((a, b) => a.time.getTime() - b.time.getTime());

    const getPastEvents = () =>
        events
            .filter((event) => isPastEvent(event))
            .sort((a, b) => b.time.getTime() - a.time.getTime());

    const getPresentEvents = () =>
        events
            .filter((event) => isPresentEvent(event))
            .sort((a, b) => a.time.getTime() - b.time.getTime());

    let content: JSX.Element;
    switch (tab) {
        case 'Create New Event':
            content = <CreateEventCell setTab={setTab} />;
            break;
        case 'Past':
            content = <EventsComponent displayEvents={getPastEvents()} tab={tab} />;
            break;
        case 'Present':
            content = <EventsComponent displayEvents={getPresentEvents()} tab={tab} />;
            break;
        case 'Future':
            content = <EventsComponent displayEvents={getFutureEvents()} tab={tab} />;
            break;
        case 'Event Invitations':
            content = <IncomingInvitationsCell setTab={setTab} />;
            break;
        default:
            assertUnreachable(tab);
    }

    return (
        <div>
            <Tabs currentTab={tab} setTab={setTab} tabNames={eventsTabNames} />
            <EventsDescription tab={tab} />
            {content}
        </div>
    );
};

interface EventsDescriptionProps {
    tab: EventsTabType;
}

const EventsDescription: React.FC<EventsDescriptionProps> = ({ tab }) => {
    let content: string;
    switch (tab) {
        case 'Future':
            content =
                'All events more than 24 hours in the future. Events hosted by your apartment are highlighted in red. Events hosted by other apartments are highlighted in blue.';
            break;
        case 'Past':
            content =
                'All events more than 24 hours in the past. Other apartments cannot be invited to these events, but enjoy a trip down memory lane. Events hosted by your apartment are highlighted in red. Events hosted by other apartments are highlighted in blue.';
            break;
        case 'Present':
            content =
                'All events within 24 hours of now. Events hosted by your apartment are highlighted in red. Events hosted by other apartments are highlighted in blue.';
            break;
        case 'Create New Event':
            content = '*other apartments can be invited after the event is created.';
            break;
        case 'Event Invitations':
            content = '';
            break;
        default:
            assertUnreachable(tab);
    }
    return <DescriptionCell content={content} />;
};

interface IncomingInvitationsCellProps {
    setTab: React.Dispatch<React.SetStateAction<EventsTabType>>;
}

const IncomingInvitationsCell: React.FC<IncomingInvitationsCellProps> = ({ setTab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [redirect, setRedirect] = useState(false);
    const [message, setMessage] = useState('');

    const invitations = user.apartment.eventsInfo.invitations;

    const handleAcceptInvitation = (invitation: ApartmentEvent) => {
        const data = { apartmentId: user.apartment._id, eventId: invitation._id };
        const options = getPutOptions(data);
        fetch('/mates/acceptEventInvitation', options).then((res) =>
            res.json().then((json) => {
                console.log(json);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, the invitation can not be accepted at this time');
                    return;
                }
                const { eventsInfo } = json;
                const formattedEventsInfo = initializeServerEventsInfo(eventsInfo);
                //TO DO: This doesn't seem like the best way to do this, the server should explicitly
                //return the new event.
                const newEvent = formattedEventsInfo.events[formattedEventsInfo.events.length - 1];
                setUser({
                    ...user,
                    apartment: { ...user.apartment, eventsInfo: formattedEventsInfo },
                });
                if (isPastEvent(newEvent)) {
                    setTab('Past');
                } else if (isPresentEvent(newEvent)) {
                    setTab('Present');
                } else {
                    setTab('Future');
                }
            }),
        );
    };

    const handleRejectInvitation = (invitation: ApartmentEvent) => {
        const data = {
            apartmentId: user.apartment._id,
            eventId: invitation._id,
        };
        const options = getPutOptions(data);
        fetch('/mates/rejectEventInvitation', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, the event invitation could not be rejected at this time');
                    return;
                }
                const { eventsInfo } = json;
                const formattedEventsInfo = initializeServerEventsInfo(eventsInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, eventsInfo: formattedEventsInfo },
                });
                setMessage('Event invitation rejected');
            });
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div>
            {message.length === 0 ? null : <p style={{ color: 'red' }}>{message}</p>}
            {invitations.length === 0 ? (
                <p style={{ fontWeight: 'bold' }}>{'You have not been invited to any events.'}</p>
            ) : (
                <div>
                    {invitations.map((invitation) => (
                        <InvitationCell
                            invitation={invitation}
                            handleAccept={handleAcceptInvitation}
                            handleDelete={handleRejectInvitation}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

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

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div>
            {message.length === 0 ? null : <p style={{ color: 'red' }}>{message}</p>}
            <h3>{'Scheduled Events:'}</h3>
            {displayEvents.map((event) => (
                <EventCell
                    event={event}
                    hosting={event.hostApartmentId === user.apartment._id}
                    canRemoveEvent={
                        event.hostApartmentId === user.apartment._id &&
                        event.creatorId === user.userId
                    }
                    canRemoveFromEvent={event.hostApartmentId === user.apartment._id}
                    handleRemoveEvent={handleDeleteEvent}
                    handleInvite={handleInvite}
                    handleRemoveAttendee={handleRemoveAttendee}
                    handleRemoveInvitee={handleRemoveInvitee}
                    handleLeaveEvent={handleLeaveEvent}
                />
            ))}
        </div>
    );
};

export default Events;
