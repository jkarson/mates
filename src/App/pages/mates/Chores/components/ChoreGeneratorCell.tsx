import React, { useContext } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { Tenant } from '../../../../common/models';
import {
    getTenantByTenantId,
    getFormattedDateString,
    formatNames,
} from '../../../../common/utilities';
import { ChoreGenerator, ChoreGeneratorID } from '../models/ChoresInfo';

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
    const { matesUser } = useContext(MatesUserContext) as MatesUserContextType;
    const tenantAssignees = choreGenerator.assigneeIds
        .map((assignee) => getTenantByTenantId(matesUser, assignee))
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
            <button onClick={() => handleDeleteSeries(choreGenerator._id)}>
                {'Delete chore series'}
            </button>
        </div>
    );
};

export default ChoreGeneratorCell;
