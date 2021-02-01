import React, { useState } from 'react';
import { getApartmentSummaryFromFriendProfile } from '../../../../common/utilities';
import StaticApartmentProfile from '../../Profile/components/StaticApartmentProfile';
import { FriendProfile } from '../models/FriendsInfo';
import ApartmentSummaryCell from './ApartmentSummaryCell';

interface FriendCellProps {
    friend: FriendProfile;
    handleDelete: (apartment: FriendProfile) => void;
    setError: (message: string) => void;
}

const FriendCell: React.FC<FriendCellProps> = ({ friend, handleDelete, setError }) => {
    const [showProfile, setShowProfile] = useState(false);
    const handleClick = () => {
        if (!showProfile) {
            setError('');
        }
        const curr = showProfile;
        setShowProfile(!curr);
    };
    return (
        <div>
            <ApartmentSummaryCell friend={getApartmentSummaryFromFriendProfile(friend)} />
            <button onClick={handleClick}>{showProfile ? 'Minimize' : 'Expand'}</button>
            <button onClick={() => handleDelete(friend)}>{'Delete Friend'}</button>
            {showProfile ? <StaticApartmentProfile apartment={friend} /> : null}
        </div>
    );
};

export default FriendCell;
