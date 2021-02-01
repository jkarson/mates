import { Bill, BillGenerator, BillsInfo } from '../pages/mates/Bills/models/BillsInfo';
import { Chore, ChoreGenerator, ChoresInfo } from '../pages/mates/Chores/models/ChoresInfo';
import { Contact } from '../pages/mates/Contacts/models/Contact';
import { ApartmentEvent, EventsInfo } from '../pages/mates/Events/models/EventsInfo';
import { ApartmentSummary, FriendsInfo } from '../pages/mates/Friends/models/FriendsInfo';
import { Message } from '../pages/mates/Messages/models/Message';
import { ProfileInfo } from '../pages/mates/Profile/models/ProfileInfo';

export interface User {
    _id: UserId;
    username: string;
    apartments: ApartmentSummary[];
    requestedApartments: ApartmentSummary[];
    selectedApartmentName?: string;
}

export interface MatesUser {
    username: string;
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
    age?: string;
    email?: string;
    number?: string;
}

export type UserId = string;
export type ApartmentId = string;

export type ClientClass = Message | BillGenerator | Bill | Chore | ChoreGenerator | ApartmentEvent;
