import { UserId, ApartmentId } from '../../../../common/models';
import { ApartmentSummary } from '../../Friends/models/FriendsInfo';
import { ServerApartmentSummary } from '../../Friends/models/ServerFriendsInfo';
import { ApartmentEventId } from './EventsInfo';

export interface ServerEventsInfo {
    events: ServerApartmentEvent[];
    invitations: ServerApartmentEvent[];
}

export interface ServerApartmentEvent {
    _id: ApartmentEventId;
    creator: string;
    creatorId: UserId;
    hostApartmentId: ApartmentId;
    time: Date;
    invitees: ServerApartmentSummary[];
    attendees: ServerApartmentSummary[];
    title: string;
    description?: string;
}
