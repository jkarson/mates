import React, { useContext, useState, useLayoutEffect } from 'react';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import StandardStyledText from '../../../common/components/StandardStyledText';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import RequestCell from '../../mates/Friends/components/RequestCell';
import { ApartmentSummary } from '../../mates/Friends/models/FriendsInfo';
import { FriendsTabType } from '../../mates/Friends/models/FriendsTabs';
import { potentialNewFriend } from '../mockData';

interface DemoRequestsCellProps {
    tab: FriendsTabType;
    setTab: React.Dispatch<React.SetStateAction<FriendsTabType>>;
    incoming: boolean;
}

const DemoRequestsCell: React.FC<DemoRequestsCellProps> = ({ incoming, setTab, tab }) => {
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
            setError('Friend request deleted.');
        }
    };

    const deleteOutgoingRequest = (apartment: ApartmentSummary) => {
        const requestIndex = user.apartment.friendsInfo.outgoingRequests.findIndex(
            (request) => request.apartmentId === apartment.apartmentId,
        );
        if (requestIndex !== -1) {
            user.apartment.friendsInfo.outgoingRequests.splice(requestIndex, 1);
            setUser({ ...user });
            setError('Outgoing friend request deleted.');
        }
    };

    const content = requests
        .sort((a, b) => (a.name < b.name ? 1 : -1))
        .map((request) => (
            <RequestCell
                request={request}
                incoming={incoming}
                handleAdd={handleAdd}
                handleDelete={handleDelete}
                key={request.apartmentId}
            />
        ));

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
            </div>
            <div className="requests-cell-error-container">
                {error.length === 0 ? null : <RedMessageCell message={error} />}
            </div>
            <div
                className={
                    incoming
                        ? 'requests-cell-content-incoming-container'
                        : 'requests-cell-content-outgoing-container'
                }
            >
                {content}
            </div>
        </div>
    );
};

export default DemoRequestsCell;
