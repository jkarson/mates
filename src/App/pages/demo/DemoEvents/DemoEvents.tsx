import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import StandardStyledText from '../../../common/components/StandardStyledText';
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
import DemoEventsComponent from './DemoEventsComponent';
import DemoIncomingInvitationsCell from './DemoIncomingInvitationsCell';

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            content = <DemoEventsComponent displayEvents={getPastEvents()} tab={tab} />;
            break;
        case 'Present':
            content = <DemoEventsComponent displayEvents={getPresentEvents()} tab={tab} />;
            break;
        case 'Future':
            content = <DemoEventsComponent displayEvents={getFutureEvents()} tab={tab} />;
            break;
        case 'Event Invitations':
            content = <DemoIncomingInvitationsCell setTab={setTab} />;
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

export default DemoEvents;
