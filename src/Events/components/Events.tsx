import React, { useContext, useState } from 'react';
import { ApartmentEvent } from '../models/ApartmentEvent';
import { UserContext, UserContextType } from '../../Common/context';
import { Apartment, Tenant } from '../../Common/models';
import Tabs from '../../Common/components/Tabs';
import {
    assertUnreachable,
    convertHoursToMS,
    getFormattedDateTimeString,
    getNewId,
    getTenant,
} from '../../Common/utilities';
import {
    FriendSummaryCell,
    getFriendSummaryCellString,
} from '../../Friends/components/FriendSummaryCell';
import {
    convertToDateWithTime,
    DateTimeInputCell,
    DateTimeInputType,
    getCurrentDateTime,
} from '../../Common/components/DateTimeInputCell';

const tabNames = ['Past', 'Present', 'Future'] as const;
type EventsTabType = typeof tabNames[number];

// TO DO: go to new tab when an event invitation is accepted the way i do when one is created

const Events: React.FC = () => {
    const [tab, setTab] = useState<EventsTabType>('Present');

    return (
        <div>
            <Tabs currentTab={tab} setTab={setTab} tabNames={tabNames} />
            <CreateEventCell setTab={setTab} />
            <IncomingInvitationsCell />
            <Description tab={tab} />
            <EventsComponent tab={tab} />
        </div>
    );
};

interface DescriptionProps {
    tab: EventsTabType;
}

const Description: React.FC<DescriptionProps> = ({ tab }) => {
    switch (tab) {
        case 'Future':
            return <p>{'All events more than 24 hours in the future.'}</p>;
        case 'Past':
            return (
                <p>
                    {
                        'All events more than 24 hours in the past. Other apartments cannot be invited to these events.'
                    }
                </p>
            );
        case 'Present':
            return <p>{'All events within 24 hours of now.'}</p>;
        default:
            assertUnreachable(tab);
    }
};

interface CreateEventInputType {
    title: string;
    description: string;
    time: DateTimeInputType;
}

interface CreateEventCellProps {
    setTab: React.Dispatch<React.SetStateAction<EventsTabType>>;
}

const CreateEventCell: React.FC<CreateEventCellProps> = ({ setTab }) => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const [showCreateEvent, setShowCreateEvent] = useState(false);

    const initialInput: CreateEventInputType = {
        title: '',
        description: '',
        time: getCurrentDateTime(),
    };
    const [input, setInput] = useState<CreateEventInputType>(initialInput);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        setInput({ ...input, [name]: event.target.value });
    };

    const setDateTimeState = (time: DateTimeInputType) => {
        setInput({ ...input, time: time });
    };

    const handleCreateEvent = () => {
        if (input.title) {
            const tenant = getTenant(user) as Tenant;

            //Note: This isn't a sufficiently broad ID Pool to safely generate a unique ID,
            //but will nonetheless do for now.
            const IDPool = [
                ...user.apartment.eventsInfo.events,
                ...user.apartment.eventsInfo.invitations,
            ];

            const newId = getNewId(IDPool);
            const newEvent: ApartmentEvent = {
                id: newId,
                creator: tenant.name + ' (' + user.apartment.name + ')',
                creatorId: tenant.id,
                time: convertToDateWithTime(input.time),
                invitees: [],
                attendees: [],
                title: input.title,
                description: input.description,
            };
            user.apartment.eventsInfo.events.push(newEvent);
            setShowCreateEvent(false);
            setInput(initialInput);

            let newTab: EventsTabType;
            if (isPastEvent(newEvent)) {
                newTab = 'Past';
            } else if (isPresentEvent(newEvent)) {
                newTab = 'Present';
            } else {
                newTab = 'Future';
            }
            setTab(newTab);
            setUser({ ...user });
            //TO DO: Save to database.
        }
    };

    return (
        <div>
            <button onClick={() => setShowCreateEvent(!showCreateEvent)}>
                {showCreateEvent ? 'Cancel' : 'Create New Event'}
            </button>
            {showCreateEvent ? (
                <div>
                    <p>{'*other apartments can be invited AFTER the event is created.'}</p>
                    <label>
                        {'Event Title: '}
                        <input
                            type="text"
                            name="title"
                            placeholder={'required'}
                            value={input.title}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        {'Event Description:'}
                        <input
                            type="text"
                            name="description"
                            placeholder={'optional'}
                            value={input.description}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <br />
                    <DateTimeInputCell state={input.time} setState={setDateTimeState} />
                    <br />
                    <br />
                    <button onClick={handleCreateEvent}>{'Create Event'}</button>
                </div>
            ) : null}
        </div>
    );
};

const IncomingInvitationsCell: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const invitations = user.apartment.eventsInfo.invitations;
    const [showInvitations, setShowInvitations] = useState(false);

    const handleAcceptInvitation = (invitation: ApartmentEvent) => {
        handleDeleteInvitation(invitation);
        user.apartment.eventsInfo.events.push(invitation);
        setUser({ ...user });
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
                <p>{'You have not been invited to any events.'}</p>
            ) : (
                <button onClick={() => setShowInvitations(!showInvitations)}>
                    {showInvitations ? 'Close' : 'Show Invitations'}
                </button>
            )}
            {showInvitations ? (
                <div>
                    {invitations.map((invitation) => (
                        <Invitation
                            invitation={invitation}
                            handleAccept={handleAcceptInvitation}
                            handleDelete={handleDeleteInvitation}
                        />
                    ))}
                </div>
            ) : null}
        </div>
    );
};

interface InvitationProps {
    invitation: ApartmentEvent;
    handleAccept: (invitation: ApartmentEvent) => void;
    handleDelete: (invitation: ApartmentEvent) => void;
}

const Invitation: React.FC<InvitationProps> = ({ invitation, handleAccept, handleDelete }) => {
    return (
        <div>
            <p style={{ fontWeight: 'bold' }}>{invitation.title}</p>
            <h5>{getFormattedDateTimeString(invitation.time)}</h5>
            <p>{'Created by ' + invitation.creator}</p>
            <button onClick={() => handleAccept(invitation)}>{'Accept Invitation'}</button>
            <button onClick={() => handleDelete(invitation)}>{'Delete Invitation'}</button>
        </div>
    );
};

interface EventsComponentProps {
    tab: EventsTabType;
}

const EventsComponent: React.FC<EventsComponentProps> = ({ tab }) => {
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

    let displayEvents: ApartmentEvent[];

    switch (tab) {
        case 'Future':
            displayEvents = getFutureEvents(allEvents);
            break;
        case 'Present':
            displayEvents = getPresentEvents(allEvents);
            break;
        case 'Past':
            displayEvents = getPastEvents(allEvents);
            break;
        default:
            assertUnreachable(tab);
    }
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
        <div style={hosting ? { border: '.5px solid blue' } : { border: '.5px solid red' }}>
            {canRemoveEvent ? (
                <button onClick={() => handleRemoveEvent(event)}>{'DELETE EVENT'}</button>
            ) : null}
            <p style={{ fontWeight: 'bold' }}>{event.title}</p>
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
                        <p>{getFriendSummaryCellString(apartment)}</p>
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

const getPastEvents = (events: ApartmentEvent[]) => {
    return events
        .filter((event) => event.time.getTime() < Date.now() - convertHoursToMS(24))
        .sort((a, b) => b.time.getTime() - a.time.getTime());
};

const getPresentEvents = (events: ApartmentEvent[]) => {
    return events
        .filter(
            (event) =>
                Date.now() - convertHoursToMS(24) <= event.time.getTime() &&
                event.time.getTime() <= Date.now() + convertHoursToMS(24),
        )
        .sort((a, b) => a.time.getTime() - b.time.getTime());
};

const getFutureEvents = (events: ApartmentEvent[]) => {
    return events
        .filter((event) => event.time.getTime() > Date.now() + convertHoursToMS(24))
        .sort((a, b) => a.time.getTime() - b.time.getTime());
};

const isPastEvent = (event: ApartmentEvent) =>
    event.time.getTime() < Date.now() - convertHoursToMS(24);

const isPresentEvent = (event: ApartmentEvent) =>
    Date.now() - convertHoursToMS(24) <= event.time.getTime() &&
    event.time.getTime() <= Date.now() + convertHoursToMS(24);

const isFutureEvent = (event: ApartmentEvent) =>
    event.time.getTime() > Date.now() + convertHoursToMS(24);

export default Events;
