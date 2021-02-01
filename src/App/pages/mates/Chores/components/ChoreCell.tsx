import React, { useContext } from 'react';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { Tenant } from '../../../../common/models';
import {
    getTenantByTenantId,
    getFormattedDateString,
    formatNames,
} from '../../../../common/utilities';
import { Chore, ChoreGeneratorID } from '../models/ChoresInfo';

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
    const { matesUser } = useContext(MatesUserContext) as MatesUserContextType;
    const tenantAssignees = chore.assigneeIds
        .map((assignee) => getTenantByTenantId(matesUser, assignee))
        .filter((assignee) => assignee !== undefined) as Tenant[];
    const completedBy: Tenant | undefined = chore.completedBy
        ? getTenantByTenantId(matesUser, chore.completedBy)
        : undefined;
    const redHeading = () => {
        if (completedBy) {
            if (completedBy.userId === matesUser.userId) {
                return true;
            } else {
                return false;
            }
        } else {
            if (assignedToUser) {
                return true;
            } else {
                return false;
            }
        }
    };
    return (
        <div style={{ borderTop: '1px solid black' }}>
            <h3 style={redHeading() ? { color: 'red' } : {}}>{chore.name}</h3>
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
            <button onClick={() => handleDeleteSeries(chore.choreGeneratorId)}>
                {'Delete all chores in series'}
            </button>
        </div>
    );
};

export default ChoreCell;
