import { ApartmentId, Tenant } from '../../../../common/models';

export interface ServerFriendsInfo {
    friends: ServerFriendProfile[];
    outgoingRequests: ServerApartmentSummary[];
    incomingRequests: ServerApartmentSummary[];
}

export interface ServerFriendProfile {
    _id: ApartmentId;
    profile: {
        code: string;
        name: string;
        quote: string;
        address: string;
    };
    tenants: Tenant[];
}

export interface ServerApartmentSummary {
    _id: ApartmentId;
    profile: {
        name: string;
    };
    tenants: {
        name: string;
    }[];
}
