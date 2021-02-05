import React from 'react';
import { FriendProfile } from '../../Friends/models/FriendsInfo';

import '../styles/ApartmentProfileCellBody.css';

interface ApartmentProfileCellBodyProps {
    apartment: FriendProfile;
}

const ApartmentProfileCellBody: React.FC<ApartmentProfileCellBodyProps> = ({ apartment }) => (
    <div className="apartment-profile-cell-body-container">
        <span>{apartment.name}</span>
        {apartment.address ? <span>{apartment.address}</span> : null}
        {apartment.quote ? (
            <span className="apartment-profile-cell-body-quote-container">
                {'"' + apartment.quote + '"'}
            </span>
        ) : null}
    </div>
);

export default ApartmentProfileCellBody;
