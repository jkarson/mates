import {
    convertHoursToMS,
    getApartmentSummariesFromServerApartmentSummaries,
    initializeDates,
} from '../../../common/utilities';
import { ServerApartmentSummary } from '../Friends/models/ServerFriendsInfo';
import { ApartmentEvent, EventsInfo } from './models/EventsInfo';
import { ServerEventsInfo } from './models/ServerEventsInfo';

export function isPastEvent(event: ApartmentEvent) {
    return event.time.getTime() < Date.now() - convertHoursToMS(24);
}

export function isPresentEvent(event: ApartmentEvent) {
    return (
        Date.now() - convertHoursToMS(24) <= event.time.getTime() &&
        event.time.getTime() <= Date.now() + convertHoursToMS(24)
    );
}

export function isFutureEvent(event: ApartmentEvent) {
    return event.time.getTime() > Date.now() + convertHoursToMS(24);
}

export function initializeServerEventsInfo(serverEventsInfo: ServerEventsInfo) {
    initializeDates(serverEventsInfo.events, 'time');
    initializeDates(serverEventsInfo.invitations, 'time');
    serverEventsInfo.events.forEach((event) => {
        event.invitees = (getApartmentSummariesFromServerApartmentSummaries(
            event.invitees,
        ) as unknown) as ServerApartmentSummary[];
        event.attendees = (getApartmentSummariesFromServerApartmentSummaries(
            event.attendees,
        ) as unknown) as ServerApartmentSummary[];
    });
    serverEventsInfo.invitations.forEach((event) => {
        event.attendees = (getApartmentSummariesFromServerApartmentSummaries(
            event.attendees,
        ) as unknown) as ServerApartmentSummary[];
        event.invitees = (getApartmentSummariesFromServerApartmentSummaries(
            event.invitees,
        ) as unknown) as ServerApartmentSummary[];
    });
    return (serverEventsInfo as unknown) as EventsInfo;
}
