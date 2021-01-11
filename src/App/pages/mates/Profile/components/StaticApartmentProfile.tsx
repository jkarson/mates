import React from 'react';
import { Apartment, FriendProfile } from '../../../../common/models';
import { TenantsProfileCell } from '../components/Profile';
import ApartmentProfileCellBody from './ApartmentProfileCellBody';

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
