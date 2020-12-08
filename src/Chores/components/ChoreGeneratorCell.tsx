import React, { useContext } from 'react';
import { UserContext, UserContextType } from '../../Common/context';
import { Tenant } from '../../Common/models';
import { formatNames, getFormattedDateString, getTenantByTenantId } from '../../Common/utilities';
import { ChoreGenerator, ChoreGeneratorID } from '../models/ChoreGenerator';

interface ChoreGeneratorCellProps {
    choreGenerator: ChoreGenerator;
    handleDeleteSeries: (cgId: ChoreGeneratorID) => void;
    assignedToUser: boolean;
}

const ChoreGeneratorCell: React.FC<ChoreGeneratorCellProps> = ({
    choreGenerator,
    handleDeleteSeries,
    assignedToUser,
}) => {
    const { user } = useContext(UserContext) as UserContextType;
    const tenantAssignees = choreGenerator.assigneeIds
        .map((assignee) => getTenantByTenantId(user, assignee))
        .filter((assignee) => assignee !== undefined) as Tenant[];
    return (
        <div style={{ borderTop: '1px solid black' }}>
            <h3 style={assignedToUser ? { color: 'red' } : {}}>{choreGenerator.name}</h3>
            <p style={{ fontWeight: 'bold' }}>
                {choreGenerator.frequency +
                    ', beginning ' +
                    getFormattedDateString(choreGenerator.starting)}
            </p>
            <p>{'Assigned to ' + formatNames(tenantAssignees.map((tenant) => tenant.name))}</p>
            <p>{'Show until completed: ' + (choreGenerator.showUntilCompleted ? 'Yes' : 'No')}</p>
            <button onClick={() => handleDeleteSeries(choreGenerator.id)}>
                {'Delete chore series'}
            </button>
        </div>
    );
};

export default ChoreGeneratorCell;
