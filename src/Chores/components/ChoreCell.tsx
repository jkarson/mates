import React, { useContext } from 'react';
import { UserContext, UserContextType } from '../../Common/context';
import { Tenant } from '../../Common/models';
import { formatNames, getFormattedDateString, getTenantByTenantId } from '../../Common/utilities';
import { Chore } from '../models/Chore';
import { ChoreGeneratorID } from '../models/ChoreGenerator';

interface ChoreCellProps {
    chore: Chore;
    assignedToUser: boolean;
    toggleCompleted: (chore: Chore) => void;
    handleDeleteChore: (chore: Chore) => void;
    handleDeleteSeries: (cgId: ChoreGeneratorID) => void;
}

const ChoreCell: React.FC<ChoreCellProps> = ({
    chore,
    assignedToUser,
    toggleCompleted,
    handleDeleteChore,
    handleDeleteSeries,
}) => {
    const { user } = useContext(UserContext) as UserContextType;
    const tenantAssignees = chore.assigneeIds
        .map((assignee) => getTenantByTenantId(user, assignee))
        .filter((assignee) => assignee !== undefined) as Tenant[];
    const completedBy: Tenant | undefined = chore.completedBy
        ? getTenantByTenantId(user, chore.completedBy)
        : undefined;
    return (
        <div style={{ borderTop: '1px solid black' }}>
            <h3 style={assignedToUser ? { color: 'red' } : {}}>{chore.name}</h3>
            <h5>{getFormattedDateString(chore.date)}</h5>
            <div>
                <p>
                    {'Assigned to '}
                    {formatNames(tenantAssignees.map((tenant) => tenant.name))}
                </p>
            </div>
            {completedBy ? <p>{'Completed by ' + completedBy.name}</p> : null}
            <p>{'Show until completed: ' + (chore.showUntilCompleted ? 'True' : 'False')}</p>
            <button onClick={() => toggleCompleted(chore)}>
                {chore.completed ? 'Mark chore as uncompleted' : 'Mark chore as completed'}
            </button>
            <button onClick={() => handleDeleteChore(chore)}>{'Delete Chore'}</button>
            <button onClick={() => handleDeleteSeries(chore.choreGeneratorID)}>
                {'Delete all chores in series'}
            </button>
        </div>
    );
};

export default ChoreCell;
