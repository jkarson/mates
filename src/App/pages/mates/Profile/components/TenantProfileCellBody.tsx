import React from 'react';
import { Tenant } from '../../../../common/models';

interface TenantProfileCellBodyProps {
    tenant: Tenant;
}

const TenantProfileCellBody: React.FC<TenantProfileCellBodyProps> = ({ tenant }) => (
    <div style={{ padding: 5 }}>
        <h3>{tenant.name}</h3>
        <p>{tenant.age ? 'age: ' + tenant.age : null}</p>
        <p>{tenant.email ? 'email: ' + tenant.email : null}</p>
        <p>{tenant.number ? 'number: ' + tenant.number : null}</p>
    </div>
);

export default TenantProfileCellBody;
