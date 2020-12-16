import React, { useContext, useState } from 'react';
import DescriptionCell from '../../../../common/components/DescriptionCell';
import Tabs from '../../../../common/components/Tabs';
import { UserContext, UserContextType } from '../../../../common/context';
import { Apartment } from '../../../../common/models';
import { assertUnreachable } from '../../../../common/utilities';
import { friendsTabNames, FriendsTabType } from '../models/FriendsTabs';
import CreateFriendRequestCell from './CreateFriendRequestCell';
import FriendCell from './FriendCell';
import RequestCell from './RequestCell';

//TO DO: all add/delete/create friend request actions are bi-directional.
//on the front end, we only need to display changes for current user. but on the back-end,
//we obviously need to adjust the other party accordingly.

const Friends: React.FC = () => {
    const [tab, setTab] = useState<FriendsTabType>('Friends');

    let content: JSX.Element;
    switch (tab) {
        case 'Friends':
            content = <FriendsCell />;
            break;
        case 'Incoming Requests':
            content = <RequestsCell incoming={true} />;
            break;
        case 'Outgoing Requests':
            content = <RequestsCell incoming={false} />;
            break;
        case 'Add New Friend':
            content = <CreateFriendRequestCell setTab={setTab} />;
            break;
        default:
            assertUnreachable(tab);
    }

    return (
        <div>
            <Tabs<FriendsTabType> currentTab={tab} setTab={setTab} tabNames={friendsTabNames} />
            <FriendsDescriptionCell />
            {content}
        </div>
    );
};

const FriendsDescriptionCell: React.FC = () => (
    <DescriptionCell
        content={
            'Connect with other apartments to view their public profile, access their contact information, and invite them to events.'
        }
    />
);

interface RequestsCellProps {
    incoming: boolean;
}

const RequestsCell: React.FC<RequestsCellProps> = ({ incoming }) => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const { friends, incomingRequests, outgoingRequests } = user.apartment.friendsInfo;
    const requests = incoming ? incomingRequests : outgoingRequests;

    const handleAdd = (apartment: Apartment) => {
        handleDelete(apartment);
        friends.push(apartment);
        setUser({ ...user });
    };
    const handleDelete = (apartment: Apartment) => {
        const requestIndex = requests.indexOf(apartment);
        requests.splice(requestIndex, 1);
        setUser({ ...user });
    };

    return (
        <div>
            {!requests || requests.length === 0 ? (
                <p>{'You have no ' + (incoming ? 'incoming' : 'outgoing') + ' friend requests'}</p>
            ) : (
                <div>
                    <p>{'Your ' + (incoming ? 'incoming' : 'outgoing') + ' friend requests:'}</p>
                    {requests
                        .sort((a, b) => (a.name < b.name ? 1 : -1))
                        .map((request) => (
                            <RequestCell
                                request={request}
                                incoming={incoming}
                                handleAdd={handleAdd}
                                handleDelete={handleDelete}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

const FriendsCell: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const friends = user.apartment.friendsInfo.friends;

    const handleDelete = (apartment: Apartment) => {
        const requestIndex = friends.indexOf(apartment);
        friends.splice(requestIndex, 1);
        //TO DO: UPDATE DATABASE
        setUser({ ...user });
    };

    return (
        <div>
            {friends.length === 0 ? (
                <p>{'You do not have any friends yet.'}</p>
            ) : (
                <>
                    <p>{'Your friends:'}</p>
                    {friends
                        .sort((a, b) => (a.name < b.name ? 1 : -1))
                        .map((friend) => (
                            <FriendCell
                                key={friend.id}
                                friend={friend}
                                handleDelete={handleDelete}
                            />
                        ))}
                </>
            )}
        </div>
    );
};

export default Friends;
