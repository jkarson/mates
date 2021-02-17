import React, { useContext, useEffect } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { Tenant, UserId } from '../../../../common/models';
import { assertUnreachable, getTenantByTenantId } from '../../../../common/utilities';
import TenantAssignmentCell from './TenantAssignmentCell';

import '../styles/AssignAssigneeModal.css';

interface AssignAssigneeModalProps {
    assigned: UserId[];
    handleSetAssigned: (assigneeIds: UserId[]) => void;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    mode: 'Assign' | 'Assignees';
}

const AssignAssigneeModal: React.FC<AssignAssigneeModalProps> = ({
    assigned,
    handleSetAssigned,
    setShow,
    mode,
}) => {
    const { matesUser } = useContext(MatesUserContext) as MatesUserContextType;
    const tenants = matesUser.apartment.tenants;

    const handleAssign = (tenantId: UserId) => {
        assigned.push(tenantId);
        handleSetAssigned(assigned);
    };

    const handleUnassign = (tenantId: UserId) => {
        const tenantIdIndex = assigned.indexOf(tenantId);
        assigned.splice(tenantIdIndex, 1);
        handleSetAssigned(assigned);
    };

    let assignmentCells: JSX.Element[];
    switch (mode) {
        case 'Assign':
            const unassignedTenants = tenants.filter((tenant) => !assigned.includes(tenant.userId));
            assignmentCells = unassignedTenants.map((tenant) => (
                <TenantAssignmentCell
                    key={tenant.userId}
                    tenant={tenant}
                    mode={mode}
                    handleAssign={handleAssign}
                    handleUnassign={handleUnassign}
                />
            ));
            break;
        case 'Assignees':
            assignmentCells = assigned.map((tenantId) => {
                const tenant = getTenantByTenantId(matesUser, tenantId) as Tenant;
                return (
                    <TenantAssignmentCell
                        key={tenant.userId}
                        tenant={tenant}
                        mode={mode}
                        handleAssign={handleAssign}
                        handleUnassign={handleUnassign}
                    />
                );
            });
            break;
        default:
            assertUnreachable(mode);
    }

    useEffect(() => {
        if (assignmentCells.length === 0) {
            setShow(false);
        }
    }, [assignmentCells.length, setShow]);

    return (
        <div className="assignee-modal-container">
            <div className="assignee-modal-empty-top" onClick={() => setShow(false)} />
            <div className="assignee-modal-empty-left" onClick={() => setShow(false)} />
            <div className="assignee-modal-empty-right" onClick={() => setShow(false)} />
            <div className="assignee-modal-empty-bottom" onClick={() => setShow(false)} />
            <div className="assignee-modal-content-container">{assignmentCells}</div>
            <div className="assignee-modal-icon-close-container" onClick={() => setShow(false)}>
                <i className="fa fa-times-circle" />
            </div>
        </div>
    );
};

export default AssignAssigneeModal;
