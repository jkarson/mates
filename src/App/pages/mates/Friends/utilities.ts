import { FriendsInfo } from '../../../common/models';
import {
    getFriendProfilesFromServerFriends,
    getApartmentSummariesFromServerFriendRequests,
} from '../../../common/utilities';

//to do: change type to server friends Info
export const initializeServerFriendsInfo = (friendsInfo: any) => {
    formatFriendsInfo(friendsInfo);
};

function formatFriendsInfo(friendsInfo: any): FriendsInfo {
    friendsInfo.friends = getFriendProfilesFromServerFriends(friendsInfo.friends);
    friendsInfo.incomingRequests = getApartmentSummariesFromServerFriendRequests(
        friendsInfo.incomingRequests,
    );
    friendsInfo.outgoingRequests = getApartmentSummariesFromServerFriendRequests(
        friendsInfo.outgoingRequests,
    );
    return friendsInfo;
}
