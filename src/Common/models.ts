import { ApartmentEvent } from '../Events/models/ApartmentEvent';
import { Contact } from '../Contacts/models/Contact';
import { Message } from '../Messages/models/Message';
import { Chore } from '../Chores/models/Chore';
import { ApartmentId, TenantId } from './types';
import { ChoreGenerator } from '../Chores/models/ChoreGenerator';

export interface Apartment {
    readonly id: ApartmentId;
    tenants: Tenant[];
    friendsInfo: FriendsInfo;
    eventsInfo: EventsInfo;
    name: string;
    messages: Message[];
    manuallyAddedContacts: Contact[];
    choresInfo: ChoresInfo;
    quote?: string;
    location?: string;
}

export interface Tenant {
    readonly id: TenantId;
    name: string;
    age?: number;
    email?: string;
    number?: string;
}

export interface User {
    tenantId: TenantId;
    apartment: Apartment;
}

export interface FriendsInfo {
    friends: Apartment[];
    outgoingRequests: Apartment[];
    incomingRequests: Apartment[];
}

export interface EventsInfo {
    events: ApartmentEvent[];
    invitations: ApartmentEvent[];
}

export interface ChoresInfo {
    choreGenerators: ChoreGenerator[];
    chores: Chore[];
}
