import {
    Apartment,
    ApartmentId,
    ApartmentSummary,
    FriendProfile,
    UserId,
} from '../../../../common/models';

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

export interface ServerApartmentEvent {
    _id: ApartmentEventId;
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
