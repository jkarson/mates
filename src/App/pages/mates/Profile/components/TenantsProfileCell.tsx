import React from 'react';
import { Tenant, UserId } from '../../../../common/models';
import TenantProfileCellBody from './TenantProfileCellBody';
import TenantProfileModificationCell from './TenantProfileModificationCell';

interface TenantsProfileCellProps {
    tenants: Tenant[];
    includesUser: boolean;
    userId?: UserId;
}

export const TenantsProfileCell: React.FC<TenantsProfileCellProps> = ({
    tenants,
    includesUser,
    userId,
}) => {
    tenants.sort((a, b) => (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1));
    return (
        <div>
            {tenants.map((tenant: Tenant) => {
                if (includesUser && userId === tenant.userId) {
                    return <TenantProfileModificationCell key={tenant.userId} />;
                } else {
                    return <TenantProfileCellBody tenant={tenant} key={tenant.userId} />;
                }
            })}
        </div>
    );
};
