import React, { useState } from 'react';
import { Apartment } from '../../../../common/models';
import StaticApartmentProfile from '../../Profile/components/StaticApartmentProfile';
import FriendSummaryCell from './FriendSummaryCell';

interface FriendCellProps {
    friend: Apartment;
    handleDelete: (apartment: Apartment) => void;
}

const FriendCell: React.FC<FriendCellProps> = ({ friend, handleDelete }) => {
    const [showProfile, setShowProfile] = useState(false);
    const handleClick = () => {
        const curr = showProfile;
        setShowProfile(!curr);
    };

    return (
        <div>
            <FriendSummaryCell friend={friend} />
            <button onClick={handleClick}>{showProfile ? 'Minimize' : 'Expand'}</button>
            <button onClick={() => handleDelete(friend)}>{'Delete Friend'}</button>
            {showProfile ? <StaticApartmentProfile apartment={friend} /> : null}
        </div>
    );
};

export default FriendCell;
