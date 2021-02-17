import React from 'react';
import { Tenant, UserId } from '../../../common/models';
import TenantProfileCellBody from '../../mates/Profile/components/TenantProfileCellBody';
import DemoTenantProfileModificationCell from './DemoTenantProfileModificationCell';

interface DemoTenantsProfileCellProps {
    tenants: Tenant[];
    includesUser: boolean;
    userId?: UserId;
}

export const DemoTenantsProfileCell: React.FC<DemoTenantsProfileCellProps> = ({
    tenants,
    includesUser,
    userId,
}) => {
    tenants.sort((a, b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1));
    return (
        <div className="tenants-profile-cell-container">
            {tenants.map((tenant: Tenant) => {
                if (includesUser && userId === tenant.userId) {
                    return <DemoTenantProfileModificationCell key={tenant.userId} />;
                } else {
                    return <TenantProfileCellBody tenant={tenant} key={tenant.userId} />;
                }
            })}
        </div>
    );
};
