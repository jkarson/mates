import React from 'react';
import { FriendProfile } from '../../Friends/models/FriendsInfo';
import ApartmentProfileCellBody from './ApartmentProfileCellBody';
import { TenantsProfileCell } from './TenantsProfileCell';

interface StaticApartmentProfileProps {
    apartment: FriendProfile;
}

const StaticApartmentProfile: React.FC<StaticApartmentProfileProps> = ({ apartment }) => (
    <div>
        <ApartmentProfileCellBody apartment={apartment} />
        <TenantsProfileCell tenants={apartment.tenants} includesUser={false} />
    </div>
);

export default StaticApartmentProfile;
