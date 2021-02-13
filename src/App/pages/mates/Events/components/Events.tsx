import React, { useContext, useLayoutEffect, useState } from 'react';
import { eventsTabNames, EventsTabType } from '../models/EventsTabs';
import CreateEventCell from './CreateEventCell';
import { isFutureEvent, isPastEvent, isPresentEvent } from '../utilities';
import Tabs from '../../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { assertUnreachable } from '../../../../common/utilities';
import IncomingInvitationsCell from './IncomingInvitationsCell';
import EventsComponent from './EventsComponent';

import '../styles/Events.css';

//TO DO: Server side, don't let one apartment be added to same event twice!

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
        <div className="events-container">
            <div className="events-tabs-container">
                <Tabs currentTab={tab} setTab={setTab} tabNames={eventsTabNames} />
            </div>
            <div className="events-content-container">{content}</div>
        </div>
    );
};

export default Events;
