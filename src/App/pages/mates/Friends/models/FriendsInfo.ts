import { ApartmentId, Tenant } from '../../../../common/models';

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

export interface ApartmentSummary {
    apartmentId: ApartmentId;
    name: string;
    tenantNames: string[];
}
