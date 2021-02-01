import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import DescriptionCell from '../../../common/components/DescriptionCell';
import Tabs from '../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { ApartmentId } from '../../../common/models';
import { assertUnreachable, getApartmentSummaryFromFriendProfile } from '../../../common/utilities';
import EventCell from '../../mates/Events/components/EventCell';
import InvitationCell from '../../mates/Events/components/InvitationCell';
import { ApartmentEvent } from '../../mates/Events/models/EventsInfo';
import { EventsTabType, eventsTabNames } from '../../mates/Events/models/EventsTabs';
import { isFutureEvent, isPastEvent, isPresentEvent } from '../../mates/Events/utilities';
import DemoCreateEventCell from './DemoCreateEventCell';

const DemoEvents: React.FC = () => {
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
            content = <DemoCreateEventCell setTab={setTab} />;
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

    const [message, setMessage] = useState('');

    const invitations = user.apartment.eventsInfo.invitations;

    const handleAcceptInvitation = (invitation: ApartmentEvent) => {
        const apartmentIndex = invitation.invitees.findIndex(
            (invitee) => invitee.apartmentId === user.apartment._id,
        );
        if (apartmentIndex !== -1) {
            invitation.invitees.splice(apartmentIndex, 1);
        }
        invitation.attendees.push({
            apartmentId: user.apartment._id,
            name: user.apartment.profile.name,
            tenantNames: user.apartment.tenants.map((tenant) => tenant.name),
        });

        const invitationIndex = user.apartment.eventsInfo.invitations.findIndex(
            (event) => event._id === invitation._id,
        );
        if (invitationIndex !== -1) {
            user.apartment.eventsInfo.invitations.splice(invitationIndex, 1);
        }
        user.apartment.eventsInfo.events.push(invitation);
        setUser({ ...user });
        if (isPastEvent(invitation)) {
            setTab('Past');
        } else if (isPresentEvent(invitation)) {
            setTab('Present');
        } else {
            setTab('Future');
        }
    };

    const handleRejectInvitation = (invitation: ApartmentEvent) => {
        const apartmentIndex = invitation.invitees.findIndex(
            (invitee) => invitee.apartmentId === user.apartment._id,
        );
        if (apartmentIndex !== -1) {
            invitation.invitees.splice(apartmentIndex, 1);
        }
        const invitationIndex = user.apartment.eventsInfo.invitations.findIndex(
            (userInvitation) => userInvitation._id === invitation._id,
        );
        if (invitationIndex !== -1) {
            user.apartment.eventsInfo.invitations.splice(invitationIndex, 1);
        }
        setUser({ ...user });
        setMessage('Event invitation rejected');
    };

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
            setMessage('You have left the event');
        }
    };

    const handleDeleteEvent = (event: ApartmentEvent) => {
        const eventIndex = user.apartment.eventsInfo.events.findIndex(
            (apartmentEvent) => apartmentEvent._id === event._id,
        );
        if (eventIndex !== -1) {
            user.apartment.eventsInfo.events.splice(eventIndex, 1);
            setUser({ ...user });
            setMessage('Event deleted');
        }
    };

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

export default DemoEvents;
