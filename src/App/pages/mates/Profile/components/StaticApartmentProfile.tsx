import React from 'react';
import { Apartment } from '../../../../common/models';
import { TenantsProfileCell } from '../components/Profile';
import ApartmentProfileCellBody from './ApartmentProfileCellBody';

interface StaticApartmentProfileProps {
    apartment: Apartment;
}

const StaticApartmentProfile: React.FC<StaticApartmentProfileProps> = ({ apartment }) => (
    <div>
        <ApartmentProfileCellBody apartment={apartment} />
        <TenantsProfileCell tenants={apartment.tenants} includesUser={false} />
    </div>
);

export default StaticApartmentProfile;
