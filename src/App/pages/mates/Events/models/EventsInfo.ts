import { UserId, ApartmentId } from '../../../../common/models';
import { ApartmentSummary } from '../../Friends/models/FriendsInfo';

export interface EventsInfo {
    events: ApartmentEvent[];
    invitations: ApartmentEvent[];
}

export interface ApartmentEvent extends ApartmentEventWithoutId {
    _id: ApartmentEventId;
}

export interface ApartmentEventWithoutId {
    creator: string;
    creatorId: UserId;
    hostApartmentId: ApartmentId;
    time: Date;
    invitees: ApartmentSummary[];
    attendees: ApartmentSummary[];
    title: string;
    description?: string;
}

export type ApartmentEventId = string;
