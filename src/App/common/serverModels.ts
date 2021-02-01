import {
    ServerBillsInfo,
    ServerBillGenerator,
    ServerBill,
} from '../pages/mates/Bills/models/ServerBillsInfo';
import {
    ServerChoresInfo,
    ServerChore,
    ServerChoreGenerator,
} from '../pages/mates/Chores/models/ServerChoresInfo';
import { ServerContact } from '../pages/mates/Contacts/models/ServerContact';
import {
    ServerApartmentEvent,
    ServerEventsInfo,
} from '../pages/mates/Events/models/ServerEventsInfo';
import { ServerFriendsInfo } from '../pages/mates/Friends/models/ServerFriendsInfo';
import { ServerMessage } from '../pages/mates/Messages/models/Message';
import { ProfileInfo } from '../pages/mates/Profile/models/ProfileInfo';
import { ApartmentId, Tenant } from './models';

export type ServerApartment = {
    readonly _id: ApartmentId;
    tenants: Tenant[];
    profile: ProfileInfo;
    friendsInfo: ServerFriendsInfo;
    eventsInfo: ServerEventsInfo;
    messages: ServerMessage[];
    manuallyAddedContacts: ServerContact[];
    choresInfo: ServerChoresInfo;
    billsInfo: ServerBillsInfo;
};

export type ServerClass =
    | ServerMessage
    | ServerBillGenerator
    | ServerBill
    | ServerChore
    | ServerChoreGenerator
    | ServerApartmentEvent;
