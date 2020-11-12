import { Apartment } from '../../Common/models';
import { TenantId } from '../../Common/types';

export interface ApartmentEvent {
    id: ApartmentEventId;
    creator: string;
    creatorId: TenantId;
    time: Date;
    invitees: Apartment[];
    attendees: Apartment[];
    title: string;
    description?: string;
}

export type ApartmentEventId = string;
