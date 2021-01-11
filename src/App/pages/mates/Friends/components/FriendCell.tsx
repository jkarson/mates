import React, { useState } from 'react';
import { Apartment, ApartmentSummary, FriendProfile } from '../../../../common/models';
import StaticApartmentProfile from '../../Profile/components/StaticApartmentProfile';
import FriendProfileSummaryCell from './FriendSummaryCell';

interface FriendCellProps {
    friend: FriendProfile;
    handleDelete: (apartment: FriendProfile) => void;
}

const FriendCell: React.FC<FriendCellProps> = ({ friend, handleDelete }) => {
    const [showProfile, setShowProfile] = useState(false);
    const handleClick = () => {
        const curr = showProfile;
        setShowProfile(!curr);
    };
    //TO DO: fix unknown type below
    return (
        <div>
            <FriendProfileSummaryCell friend={friend} />
            <button onClick={handleClick}>{showProfile ? 'Minimize' : 'Expand'}</button>
            <button onClick={() => handleDelete(friend)}>{'Delete Friend'}</button>
            {showProfile ? <StaticApartmentProfile apartment={friend} /> : null}
        </div>
    );
};

export default FriendCell;
