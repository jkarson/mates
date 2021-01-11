import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import DescriptionCell from '../../../../common/components/DescriptionCell';
import Tabs from '../../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { Apartment, ApartmentSummary, FriendProfile } from '../../../../common/models';
import {
    assertUnreachable,
    getApartmentSummariesFromServerFriendRequests,
    getDeleteOptions,
    getFriendProfileFromApartment,
    getFriendProfilesFromServerFriends,
    getPostOptions,
} from '../../../../common/utilities';
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
            content = <RequestsCell incoming={true} setTab={setTab} />;
            break;
        case 'Outgoing Requests':
            content = <RequestsCell incoming={false} setTab={setTab} />;
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
    setTab: React.Dispatch<React.SetStateAction<FriendsTabType>>;
    incoming: boolean;
}

const RequestsCell: React.FC<RequestsCellProps> = ({ incoming, setTab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const { friends, incomingRequests, outgoingRequests } = user.apartment.friendsInfo;
    const requests = incoming ? incomingRequests : outgoingRequests;
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');

    const handleAdd = (apartment: ApartmentSummary) => {
        const data = {
            userApartmentId: user.apartment._id,
            friendApartmentId: apartment.apartmentId,
        };
        const options = getPostOptions(data);
        fetch('/mates/acceptFriendRequest', options)
            .then((response) => response.json())
            .then((json) => {
                const { success, authenticated } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError('Sorry, the friend request could not be accepted at this time');
                    return;
                }
                const { friends, incomingRequests } = json;
                const formattedFriends = getFriendProfilesFromServerFriends(friends);
                const formattedIncomingRequests = getApartmentSummariesFromServerFriendRequests(
                    incomingRequests,
                );
                setUser({
                    ...user,
                    apartment: {
                        ...user.apartment,
                        friendsInfo: {
                            ...user.apartment.friendsInfo,
                            friends: formattedFriends,
                            incomingRequests: formattedIncomingRequests,
                        },
                    },
                });
                setError('');
                setTab('Friends');
            });
    };
    const handleDelete = (apartment: ApartmentSummary) => {
        const data = {
            userApartmentId: user.apartment._id,
            requestApartmentId: apartment.apartmentId,
        };
        const options = getDeleteOptions(data);
        if (incoming) {
            deleteIncomingRequest(options);
        } else {
            deleteOutgoingRequest(options);
        }
        // const requestIndex = requests.indexOf(apartment);
        // requests.splice(requestIndex, 1);
        // setUser({ ...user });
        //TO DO: IMPLEMENT W SERVER
    };

    const deleteIncomingRequest = (options: object) => {
        fetch('/mates/deleteIncomingFriendRequest', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError('Sorry, the friend request could not be deleted at this time.');
                    return;
                }
                const { incomingRequests } = json;
                const formattedIncomingRequests = getApartmentSummariesFromServerFriendRequests(
                    incomingRequests,
                );
                setUser({
                    ...user,
                    apartment: {
                        ...user.apartment,
                        friendsInfo: {
                            ...user.apartment.friendsInfo,
                            incomingRequests: formattedIncomingRequests,
                        },
                    },
                });
                setError('');
            });
    };

    const deleteOutgoingRequest = (options: object) => {
        fetch('/mates/deleteOutgoingFriendRequest', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError('Sorry, the friend request could not be deleted at this time.');
                    return;
                }
                const { outgoingRequests } = json;
                const formattedOutgoingRequests = getApartmentSummariesFromServerFriendRequests(
                    outgoingRequests,
                );
                setUser({
                    ...user,
                    apartment: {
                        ...user.apartment,
                        friendsInfo: {
                            ...user.apartment.friendsInfo,
                            outgoingRequests: formattedOutgoingRequests,
                        },
                    },
                });
                setError('');
            });
        //);
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

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
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = (friend: FriendProfile) => {
        const data = {
            apartmentId: user.apartment._id,
            friendApartmentId: friend.apartmentId,
        };
        const options = getDeleteOptions(data);
        fetch('/mates/deleteFriend', options)
            .then((response) => response.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError('Sorry, your friend could not be deleted at this time.');
                    return;
                }
                const { friends } = json;
                const formattedFriends = getFriendProfilesFromServerFriends(friends);
                setUser({
                    ...user,
                    apartment: {
                        ...user.apartment,
                        friendsInfo: { ...user.apartment.friendsInfo, friends: formattedFriends },
                    },
                });
            });
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

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
                            />
                        ))}
                </>
            )}
        </div>
    );
};

export default Friends;
