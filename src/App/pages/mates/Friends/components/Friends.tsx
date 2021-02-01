import React, { useContext, useLayoutEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import DescriptionCell from '../../../../common/components/DescriptionCell';
import Tabs from '../../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import {
    assertUnreachable,
    getApartmentSummariesFromServerApartmentSummaries,
    getDeleteOptions,
    getFriendProfilesFromServerFriendProfiles,
    getPostOptions,
} from '../../../../common/utilities';
import { ApartmentSummary, FriendProfile } from '../models/FriendsInfo';
import { friendsTabNames, FriendsTabType } from '../models/FriendsTabs';
import CreateFriendRequestCell from './CreateFriendRequestCell';
import FriendCell from './FriendCell';
import RequestCell from './RequestCell';

// to do: should i have a message when friends are deleted? or is the messaging really more for development?
//or for errors? i kind of think a message can help... see DemoFriends for method of handling
//delete friend message and erasing error when a friend cell is expanded

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

//TO DO: verify that message / tab as prop work as they should
interface RequestsCellProps {
    setTab: React.Dispatch<React.SetStateAction<FriendsTabType>>;
    incoming: boolean;
    tab: FriendsTabType;
}

const RequestsCell: React.FC<RequestsCellProps> = ({ incoming, setTab, tab }) => {
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
                const formattedFriends = getFriendProfilesFromServerFriendProfiles(friends);
                const formattedIncomingRequests = getApartmentSummariesFromServerApartmentSummaries(
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
                const formattedIncomingRequests = getApartmentSummariesFromServerApartmentSummaries(
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
                setError('Friend request deleted');
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
                const formattedOutgoingRequests = getApartmentSummariesFromServerApartmentSummaries(
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
                setError('Outgoing friend request deleted');
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
                const formattedFriends = getFriendProfilesFromServerFriendProfiles(friends);
                setUser({
                    ...user,
                    apartment: {
                        ...user.apartment,
                        friendsInfo: { ...user.apartment.friendsInfo, friends: formattedFriends },
                    },
                });
                setError('Friend deleted');
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
                                setError={setError}
                            />
                        ))}
                </>
            )}
        </div>
    );
};

export default Friends;
