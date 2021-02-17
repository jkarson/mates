import React from 'react';
import { SimpleButton } from '../../../../common/components/SimpleButtons';
import { Tenant, UserId } from '../../../../common/models';
import { assertUnreachable } from '../../../../common/utilities';

import '../styles/TenantAssignmentCell.css';

interface TenantAssignmentCellProps {
    tenant: Tenant;
    handleAssign: (tenantId: UserId) => void;
    handleUnassign: (tenantId: UserId) => void;
    mode: 'Assign' | 'Assignees';
}

const TenantAssignmentCell: React.FC<TenantAssignmentCellProps> = ({
    tenant,
    handleAssign,
    handleUnassign,
    mode,
}) => {
    let button: JSX.Element;
    switch (mode) {
        case 'Assign':
            button = <SimpleButton onClick={() => handleAssign(tenant.userId)} text="Assign" />;
            break;
        case 'Assignees':
            button = (
                <div className="tenant-assignment-cell-unassign-button-container">
                    <SimpleButton onClick={() => handleUnassign(tenant.userId)} text="Unassign" />
                </div>
            );
            break;
        default:
            assertUnreachable(mode);
    }

    return (
        <div className="tenant-assignment-cell-container">
            <span>{tenant.name}</span>
            <div className="tenant-assignment-cell-button-container">{button}</div>
        </div>
    );
};

export default TenantAssignmentCell;
