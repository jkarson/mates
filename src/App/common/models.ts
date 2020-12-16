import { Bill } from '../pages/mates/Bills/models/Bill';
import { BillGenerator } from '../pages/mates/Bills/models/BillGenerator';
import { Chore } from '../pages/mates/Chores/models/Chore';
import { ChoreGenerator } from '../pages/mates/Chores/models/ChoreGenerator';
import { Contact } from '../pages/mates/Contacts/models/Contact';
import { ApartmentEvent } from '../pages/mates/Events/models/ApartmentEvent';
import { Message } from '../pages/mates/Messages/models/Message';

// to do: Profile info and extract out quote/location
// need to reorg the structure without breaking client code. can i use careful renames?
//
// to do: move context provider up the tree so i can play w it here
//
/*
User
    id
    username
    apartments
    selectedApartment

Apartment





*/

export interface Apartment {
    readonly id: ApartmentId;
    tenants: Tenant[];
    friendsInfo: FriendsInfo;
    eventsInfo: EventsInfo;
    name: string;
    messages: Message[];
    manuallyAddedContacts: Contact[];
    choresInfo: ChoresInfo;
    billsInfo: BillsInfo;
    quote?: string;
    location?: string;
}

export type ApartmentId = string;

export interface Tenant {
    readonly id: TenantId;
    name: string;
    age?: number;
    email?: string;
    number?: string;
}

export type TenantId = string;

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

export interface BillsInfo {
    billGenerators: BillGenerator[];
    bills: Bill[];
}
