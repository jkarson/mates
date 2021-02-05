import React from 'react';
import { Tenant, UserId } from '../../../../common/models';
import TenantProfileCellBody from './TenantProfileCellBody';
import TenantProfileModificationCell from './TenantProfileModificationCell';

import '../styles/TenantsProfileCell.css';

//Extension: refactor so that the inner/outer boxes live here, as opposed to living separately in
//TPMC and TPCB below.

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
        <div className="tenants-profile-cell-container">
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
