import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import {
    getDeleteOptions,
    getFriendProfilesFromServerFriendProfiles,
} from '../../../../common/utilities';
import { FriendProfile } from '../models/FriendsInfo';
import FriendCell from './FriendCell';
import RedMessageCell from '../../../../common/components/RedMessageCell';
import StandardStyledText from '../../../../common/components/StandardStyledText';

import '../styles/FriendsCell.css';

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

    const content = friends
        .sort((a, b) => (a.name < b.name ? 1 : -1))
        .map((friend) => (
            <FriendCell
                key={friend.apartmentId}
                friend={friend}
                handleDelete={handleDelete}
                setError={setError}
            />
        ));

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="friends-cell-container">
            <div className="friends-cell-description-container">
                {friends.length === 0 ? (
                    <StandardStyledText
                        text={
                            'You do not have any friends yet. Connect with other apartments to view their public profile, access their contact information, and invite them to events.'
                        }
                    />
                ) : null}
            </div>
            <div className="friends-cell-error-container">
                {error.length === 0 ? null : <RedMessageCell message={error} />}
            </div>
            <div className="friends-cell-content-container">{content}</div>
        </div>
    );
};

export default FriendsCell;
