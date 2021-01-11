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

// note / to do: as far as i can tell, i dont need any ids on the front end except for the apartment
//id so that i can display it. i guess i'll need tenant ids in mates probably. but at the "User" layer, what
//do i need an id for?

export interface User {
    //readonly id: UserId;
    username: string;
    apartments: ApartmentSummary[];
    requestedApartments: ApartmentSummary[];
}

export interface ApartmentSummary {
    apartmentId: ApartmentId;
    name: string;
    tenantNames: string[];
}

export interface MatesUser {
    userId: UserId;
    apartment: Apartment;
}

export interface Apartment {
    readonly _id: ApartmentId;
    tenants: Tenant[];
    profile: ProfileInfo;
    friendsInfo: FriendsInfo;
    eventsInfo: EventsInfo;
    messages: Message[];
    manuallyAddedContacts: Contact[];
    choresInfo: ChoresInfo;
    billsInfo: BillsInfo;
}

export interface Tenant {
    userId: UserId;
    name: string;
    age?: number;
    email?: string;
    number?: string;
}

export interface ProfileInfo {
    code: string;
    name: string;
    quote?: string;
    address?: string;
    requests: JoinRequest[];
}

export interface JoinRequest {
    _id: UserId;
    username: string;
}

export interface FriendsInfo {
    friends: FriendProfile[];
    outgoingRequests: ApartmentSummary[];
    incomingRequests: ApartmentSummary[];
}

export interface FriendProfile {
    apartmentId: ApartmentId;
    code: string;
    name: string;
    quote?: string;
    address?: string;
    tenants: Tenant[];
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

export type UserId = string;
export type ApartmentId = string;
