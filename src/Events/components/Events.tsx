import React, { useContext, useState } from 'react';
import { ApartmentEvent } from '../models/ApartmentEvent';
import { UserContext, UserContextType } from '../../Common/context';
import { Apartment } from '../../Common/models';
import Tabs from '../../Common/components/Tabs';
import { assertUnreachable } from '../../Common/utilities';
import DescriptionCell from '../../Common/components/DescriptionCell';
import { eventsTabNames, EventsTabType } from '../models/EventsTabs';
import CreateEventCell from './CreateEventCell';
import { isFutureEvent, isPastEvent, isPresentEvent } from '../utilities';
import EventCell from './EventCell';
import InvitationCell from './InvitationCell';

//EXTENSION: Guarantee that events move from past to present and to future
//in real time at the 24 hour mark

const Events: React.FC = () => {
    const [tab, setTab] = useState<EventsTabType>('Present');

    const { user } = useContext(UserContext) as UserContextType;
    const events = user.apartment.eventsInfo.events;

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
            content = <EventsComponent displayEvents={getPastEvents()} />;
            break;
        case 'Present':
            content = <EventsComponent displayEvents={getPresentEvents()} />;
            break;
        case 'Future':
            content = <EventsComponent displayEvents={getFutureEvents()} />;
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
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const invitations = user.apartment.eventsInfo.invitations;

    const handleAcceptInvitation = (invitation: ApartmentEvent) => {
        handleDeleteInvitation(invitation);
        user.apartment.eventsInfo.events.push(invitation);
        setUser({ ...user });
        if (isPastEvent(invitation)) {
            setTab('Past');
        } else if (isPresentEvent(invitation)) {
            setTab('Present');
        } else {
            setTab('Future');
        }
        //TO DO: update back end.
    };

    const handleDeleteInvitation = (invitation: ApartmentEvent) => {
        const invitationIndex = invitations.indexOf(invitation);
        invitations.splice(invitationIndex, 1);
        setUser({ ...user });
        //TO DO: update back end.
    };

    return (
        <div>
            {invitations.length === 0 ? (
                <p style={{ fontWeight: 'bold' }}>{'You have not been invited to any events.'}</p>
            ) : (
                <div>
                    {invitations.map((invitation) => (
                        <InvitationCell
                            invitation={invitation}
                            handleAccept={handleAcceptInvitation}
                            handleDelete={handleDeleteInvitation}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

interface EventsComponentProps {
    displayEvents: ApartmentEvent[];
}

const EventsComponent: React.FC<EventsComponentProps> = ({ displayEvents }) => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const allEvents = user.apartment.eventsInfo.events;

    const handleInvite = (event: ApartmentEvent, invitee: Apartment) => {
        event.invitees.push(invitee);
        setUser({ ...user });
        //TO DO: Save to database, and handle invitation on the back end.
    };

    const handleRemoveInvitee = (event: ApartmentEvent, invitee: Apartment) => {
        const inviteeIndex = event.invitees.indexOf(invitee);
        event.invitees.splice(inviteeIndex, 1);
        setUser({ ...user });
        //TO DO: Save to database, and handle invitation removal on the back end.
    };

    const handleRemoveAttendee = (event: ApartmentEvent, attendee: Apartment) => {
        const attendeeIndex = event.attendees.indexOf(attendee);
        event.attendees.splice(attendeeIndex, 1);
        setUser({ ...user });
        //TO DO: Save to database, and handle attendee removal on the back end.
    };

    const handleRemoveEvent = (event: ApartmentEvent) => {
        const eventIndex = allEvents.indexOf(event);
        allEvents.splice(eventIndex, 1);
        setUser({ ...user });
        //TO DO: Save to database, and handle event removal on the back end.
        //Note that this gets called both when a creator deletes their own event, and
        //when a tenant elects to leave another apartment's event. The logic can be split if
        //necessary, although this seems like an easy thing to intuit on the spot on the back-end
        //or in this method
    };

    return (
        <div>
            <h3>{'Scheduled Events:'}</h3>
            {displayEvents.map((event) => (
                <EventCell
                    event={event}
                    hosting={user.apartment.tenants
                        .map((tenant) => tenant.id)
                        .includes(event.creatorId)}
                    canRemoveEvent={event.creatorId === user.tenantId}
                    handleRemoveEvent={handleRemoveEvent}
                    handleInvite={handleInvite}
                    handleRemoveAttendee={handleRemoveAttendee}
                    handleRemoveInvitee={handleRemoveInvitee}
                />
            ))}
        </div>
    );
};

export default Events;
