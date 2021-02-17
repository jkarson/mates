import React, { useContext, useState } from 'react';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import StandardStyledText from '../../../common/components/StandardStyledText';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import FriendCell from '../../mates/Friends/components/FriendCell';
import { FriendProfile } from '../../mates/Friends/models/FriendsInfo';

const DemoFriendsCell: React.FC = () => {
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
            setError('Friend deleted.');
        }
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

export default DemoFriendsCell;
