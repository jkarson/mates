import { EventsInfo } from '../../../common/models';
import {
    convertHoursToMS,
    getApartmentSummariesFromServerFriendRequests,
    getFriendProfilesFromServerFriends,
    initializeDates,
} from '../../../common/utilities';
import { ApartmentEvent } from './models/ApartmentEvent';
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
        event.invitees = getApartmentSummariesFromServerFriendRequests(event.invitees);
        event.attendees = getApartmentSummariesFromServerFriendRequests(event.attendees);
    });
    serverEventsInfo.invitations.forEach((event) => {
        event.attendees = getApartmentSummariesFromServerFriendRequests(event.attendees);
        event.invitees = getApartmentSummariesFromServerFriendRequests(event.invitees);
    });
    console.log('server events info after formatting:');
    console.log(serverEventsInfo);
    return (serverEventsInfo as unknown) as EventsInfo;
}
