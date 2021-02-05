import React, { useContext, useLayoutEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import RedMessageCell from '../../../../common/components/RedMessageCell';
import StandardStyledText from '../../../../common/components/StandardStyledText';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import {
    getPostOptions,
    getFriendProfilesFromServerFriendProfiles,
    getApartmentSummariesFromServerApartmentSummaries,
    getDeleteOptions,
} from '../../../../common/utilities';
import { ApartmentSummary } from '../models/FriendsInfo';
import { FriendsTabType } from '../models/FriendsTabs';
import RequestCell from './RequestCell';

import '../styles/RequestsCell.css';

interface RequestsCellProps {
    setTab: React.Dispatch<React.SetStateAction<FriendsTabType>>;
    incoming: boolean;
    tab: FriendsTabType;
}

const RequestsCell: React.FC<RequestsCellProps> = ({ incoming, setTab, tab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const { incomingRequests, outgoingRequests } = user.apartment.friendsInfo;
    const requests = incoming ? incomingRequests : outgoingRequests;
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState('');

    useLayoutEffect(() => {
        setError('');
    }, [tab]);

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
    };

    const content = requests
        .sort((a, b) => (a.name < b.name ? 1 : -1))
        .map((request) => (
            <RequestCell
                request={request}
                incoming={incoming}
                handleAdd={handleAdd}
                handleDelete={handleDelete}
            />
        ));

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="requests-cell-container">
            <div className="requests-cell-description-container">
                {incoming ? (
                    requests.length === 0 ? (
                        <StandardStyledText text={'You have no incoming friend requests.'} />
                    ) : (
                        <div className="requests-cell-description-incoming-centered-container">
                            <StandardStyledText text={'Your incoming friend requests:'} />
                        </div>
                    )
                ) : (
                    <div className="requests-cell-description-outgoing-container">
                        <StandardStyledText
                            text={
                                requests.length === 0
                                    ? 'You have no outgoing friend requests.'
                                    : 'Your outgoing friend requests:'
                            }
                        />
                    </div>
                )}
                {/* {requests.length === 0 ? (
                    <StandardStyledText
                        text={
                            'You have no ' +
                            (incoming ? 'incoming' : 'outgoing') +
                            ' friend requests'
                        }
                    />
                ) : (
                    <StandardStyledText
                        text={'Your ' + (incoming ? 'incoming' : 'outgoing') + ' friend requests'}
                    />
                )} */}
            </div>
            <div className="requests-cell-error-container">
                {error.length === 0 ? null : <RedMessageCell message={error} />}
            </div>
            <div className="requests-cell-content-container">{content}</div>
        </div>
    );
};

export default RequestsCell;
