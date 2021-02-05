import React from 'react';
import { Tenant } from '../../../../common/models';
import { formatPhoneNumber } from '../../../../common/utilities';

import '../styles/TenantProfileCellBody.css';

interface TenantProfileCellBodyProps {
    tenant: Tenant;
}

const TenantProfileCellBody: React.FC<TenantProfileCellBodyProps> = ({ tenant }) => (
    <div className="tenant-profile-cell-body-outer-container">
        <div className="tenant-profile-cell-body-inner-container">
            <span>{tenant.name}</span>
            {tenant.age ? <span>{tenant.age + ' years old'}</span> : null}
            {tenant.email ? <span>{tenant.email}</span> : null}
            {tenant.number ? <span>{formatPhoneNumber(tenant.number)}</span> : null}
        </div>
    </div>
);

export default TenantProfileCellBody;
