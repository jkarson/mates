import {
    getApartmentSummariesFromServerApartmentSummaries,
    getFriendProfilesFromServerFriendProfiles,
} from '../../../common/utilities';
import { FriendsInfo } from './models/FriendsInfo';
import { ServerFriendsInfo } from './models/ServerFriendsInfo';

export const initializeServerFriendsInfo = (friendsInfo: ServerFriendsInfo) => {
    formatFriendsInfo(friendsInfo);
};

function formatFriendsInfo(friendsInfo: any): FriendsInfo {
    friendsInfo.friends = getFriendProfilesFromServerFriendProfiles(friendsInfo.friends);
    friendsInfo.incomingRequests = getApartmentSummariesFromServerApartmentSummaries(
        friendsInfo.incomingRequests,
    );
    friendsInfo.outgoingRequests = getApartmentSummariesFromServerApartmentSummaries(
        friendsInfo.outgoingRequests,
    );
    return friendsInfo;
}
