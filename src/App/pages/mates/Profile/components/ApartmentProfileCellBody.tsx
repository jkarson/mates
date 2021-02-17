import React from 'react';
import { FriendProfile } from '../../Friends/models/FriendsInfo';

import '../styles/ApartmentProfileCellBody.css';

interface ApartmentProfileCellBodyProps {
    apartment: FriendProfile;
}

const ApartmentProfileCellBody: React.FC<ApartmentProfileCellBodyProps> = ({ apartment }) => (
    <div className="apartment-profile-cell-body-container">
        <span>{apartment.name}</span>
        {apartment.address ? (
            <div className="apartment-profile-cell-body-address-container">
                <span>{apartment.address}</span>
            </div>
        ) : null}
        {apartment.quote ? (
            <div className="apartment-profile-cell-body-quote-container">
                <span>{'"' + apartment.quote + '"'}</span>
            </div>
        ) : null}
    </div>
);

export default ApartmentProfileCellBody;
