import React from 'react';
import { FriendProfile } from '../../Friends/models/FriendsInfo';

interface ApartmentProfileCellBodyProps {
    apartment: FriendProfile;
}

const ApartmentProfileCellBody: React.FC<ApartmentProfileCellBodyProps> = ({ apartment }) => (
    <div>
        <h1>{apartment.name}</h1>
        <p>{apartment.address}</p>
        <p style={{ color: 'blue' }}>{apartment.quote ? '"' + apartment.quote + '"' : null}</p>
    </div>
);

export default ApartmentProfileCellBody;
