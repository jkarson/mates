import React, { useContext, useLayoutEffect, useState } from 'react';
import DescriptionCell from '../../../common/components/DescriptionCell';
import Tabs from '../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { assertUnreachable } from '../../../common/utilities';
import FriendCell from '../../mates/Friends/components/FriendCell';
import RequestCell from '../../mates/Friends/components/RequestCell';
import { ApartmentSummary, FriendProfile } from '../../mates/Friends/models/FriendsInfo';
import { FriendsTabType, friendsTabNames } from '../../mates/Friends/models/FriendsTabs';
import { potentialNewFriend } from '../models/mockData';
import DemoCreateFriendRequestCell from './DemoCreateFriendRequestCell';

const Friends: React.FC = () => {
    const [tab, setTab] = useState<FriendsTabType>('Friends');
    const { matesUser } = useContext(MatesUserContext) as MatesUserContextType;

    useLayoutEffect(() => {
        if (matesUser.apartment.friendsInfo.incomingRequests.length > 0) {
            setTab('Incoming Requests');
            return;
        }
        if (matesUser.apartment.friendsInfo.friends.length > 0) {
            setTab('Friends');
            return;
        }
        setTab('Add New Friend');
    }, []);

    let content: JSX.Element;
    switch (tab) {
        case 'Friends':
            content = <FriendsCell />;
            break;
        case 'Incoming Requests':
            content = <RequestsCell incoming={true} setTab={setTab} tab={tab} />;
            break;
        case 'Outgoing Requests':
            content = <RequestsCell incoming={false} setTab={setTab} tab={tab} />;
            break;
        case 'Add New Friend':
            content = <DemoCreateFriendRequestCell />;
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
    tab: FriendsTabType;
    setTab: React.Dispatch<React.SetStateAction<FriendsTabType>>;
    incoming: boolean;
}

const RequestsCell: React.FC<RequestsCellProps> = ({ incoming, setTab, tab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const { incomingRequests, outgoingRequests } = user.apartment.friendsInfo;
    const requests = incoming ? incomingRequests : outgoingRequests;
    const [error, setError] = useState('');

    useLayoutEffect(() => {
        setError('');
    }, [tab]);

    const handleAdd = (apartment: ApartmentSummary) => {
        const requestIndex = user.apartment.friendsInfo.incomingRequests.findIndex(
            (request) => request.apartmentId === apartment.apartmentId,
        );
        if (requestIndex !== -1) {
            user.apartment.friendsInfo.incomingRequests.splice(requestIndex, 1);
        }

        //Note: this is hard-coded and corresponds
        //with the one friend request included in the demo
        user.apartment.friendsInfo.friends.push(potentialNewFriend);
        setError('');
        setTab('Friends');
    };

    const handleDelete = (apartment: ApartmentSummary) => {
        if (incoming) {
            deleteIncomingRequest(apartment);
        } else {
            deleteOutgoingRequest(apartment);
        }
    };

    const deleteIncomingRequest = (apartment: ApartmentSummary) => {
        const requestIndex = user.apartment.friendsInfo.incomingRequests.findIndex(
            (request) => request.apartmentId === apartment.apartmentId,
        );
        if (requestIndex !== -1) {
            user.apartment.friendsInfo.incomingRequests.splice(requestIndex, 1);
            setUser({ ...user });
            setError('Incoming Request Deleted');
        }
    };

    const deleteOutgoingRequest = (apartment: ApartmentSummary) => {
        const requestIndex = user.apartment.friendsInfo.outgoingRequests.findIndex(
            (request) => request.apartmentId === apartment.apartmentId,
        );
        if (requestIndex !== -1) {
            user.apartment.friendsInfo.outgoingRequests.splice(requestIndex, 1);
            setUser({ ...user });
            setError('Outgoing Request Deleted');
        }
    };

    return (
        <div>
            {error.length === 0 ? null : <p style={{ color: 'red' }}>{error}</p>}
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
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const friends = user.apartment.friendsInfo.friends;
    const [error, setError] = useState('');

    const handleDelete = (friend: FriendProfile) => {
        const friendIndex = user.apartment.friendsInfo.friends.findIndex(
            (apartmentFriend) => apartmentFriend.apartmentId === friend.apartmentId,
        );
        if (friendIndex !== -1) {
            user.apartment.friendsInfo.friends.splice(friendIndex, 1);
            setUser({ ...user });
            setError('Friend Deleted');
        }
    };

    return (
        <div>
            {error.length === 0 ? null : <p style={{ color: 'red' }}>{error}</p>}
            {friends.length === 0 ? (
                <p>{'You do not have any friends yet.'}</p>
            ) : (
                <>
                    <p>{'Your friends:'}</p>
                    {friends
                        .sort((a, b) => (a.name < b.name ? 1 : -1))
                        .map((friend) => (
                            <FriendCell
                                key={friend.apartmentId}
                                friend={friend}
                                handleDelete={handleDelete}
                                setError={setError}
                            />
                        ))}
                </>
            )}
        </div>
    );
};

export default Friends;
