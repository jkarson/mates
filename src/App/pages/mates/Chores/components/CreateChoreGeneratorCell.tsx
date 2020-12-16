import React, { useContext, useState } from 'react';
import DateInputCell from '../../../../common/components/DateInputCell';
import FrequencySelectCell from '../../../../common/components/FrequencySelectCell';
import { UserContext, UserContextType } from '../../../../common/context';
import { TenantId, Tenant } from '../../../../common/models';
import { StateProps } from '../../../../common/types';
import {
    getTodaysDate,
    getNewId,
    getYesterdaysDateFromDate,
    getTenantByTenantId,
    formatNames,
} from '../../../../common/utilities';

import { choreFrequencies, ChoreFrequency } from '../models/ChoreFrequency';
import { ChoreGenerator } from '../models/ChoreGenerator';
import { ChoresTabType } from '../models/ChoresTabs';

interface CreateChoreGeneratorInput {
    name: string;
    assigneeIds: TenantId[];
    frequency: ChoreFrequency;
    starting: Date;
    showUntilCompleted: boolean;
}

interface CreateChoreGeneratorCellProps {
    setTab: React.Dispatch<React.SetStateAction<ChoresTabType>>;
}

const CreateChoreGeneratorCell: React.FC<CreateChoreGeneratorCellProps> = ({ setTab }) => {
    const { user, setUser } = useContext(UserContext) as UserContextType;

    const initialCreateChoreGeneratorInput: CreateChoreGeneratorInput = {
        name: '',
        assigneeIds: [],
        frequency: 'Daily',
        starting: getTodaysDate(),
        showUntilCompleted: true,
    };

    const [input, setInput] = useState<CreateChoreGeneratorInput>(initialCreateChoreGeneratorInput);

    const handleSetAssigneeIds = (assigneeIds: TenantId[]) => {
        setInput({ ...input, assigneeIds: [...assigneeIds] });
    };

    const handleSetFrequency = (frequency: ChoreFrequency) => {
        setInput({ ...input, frequency: frequency });
    };

    const handleSetDate = (date: Date) => {
        setInput({ ...input, starting: date });
    };

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInput({ ...input, name: value });
    };

    const toggleShowUntilCompleted = () => {
        const newShowUntilCompleted = !input.showUntilCompleted;
        setInput({ ...input, showUntilCompleted: newShowUntilCompleted });
    };

    const createChoreGenerator = () => {
        if (!input.name) {
            return;
        }
        const assigneeIds: TenantId[] =
            input.assigneeIds.length > 0
                ? input.assigneeIds
                : user.apartment.tenants.map((tenant) => tenant.id);
        const starting = new Date(input.starting.getTime());
        const newChoreGenerator: ChoreGenerator = {
            id: getNewId(user.apartment.choresInfo.choreGenerators),
            name: input.name,
            assigneeIds: [...assigneeIds],
            frequency: input.frequency,
            starting: starting,
            showUntilCompleted: input.showUntilCompleted,
            updatedThrough: getYesterdaysDateFromDate(starting),
        };
        user.apartment.choresInfo.choreGenerators.push(newChoreGenerator);
        setUser({ ...user });
        setInput({
            name: '',
            assigneeIds: [],
            frequency: 'Daily',
            starting: getTodaysDate(),
            showUntilCompleted: true,
        });
        setTab('Summary');
    };

    return (
        <div>
            <label>
                {'Chore Title: '}
                <input
                    type="text"
                    value={input.name}
                    placeholder={'*Required'}
                    name="name"
                    onChange={handleChangeName}
                />
            </label>
            <br />
            <ChoreGeneratorAssignmentCell
                state={input.assigneeIds}
                setState={handleSetAssigneeIds}
            />
            <FrequencySelectCell<ChoreFrequency>
                state={input.frequency}
                setState={handleSetFrequency}
                frequencies={choreFrequencies}
            />
            <DateInputCell state={input.starting} setState={handleSetDate} showReset={true} />
            <p>
                {'Show until completed: '}
                <span style={{ fontWeight: 'bold' }}>
                    {input.showUntilCompleted ? 'YES' : 'NO'}
                </span>
                <button onClick={toggleShowUntilCompleted}>{'Toggle'}</button>
            </p>
            <p style={{ fontWeight: 'bold' }}>
                {
                    'By default, chores will remain in your chore lists until they are completed. To turn off this behavior for this chore set, and automatically delete these chores once their assigned date passes, use the toggle option above.'
                }
            </p>
            <button onClick={createChoreGenerator}>{'Create Chore Set'}</button>
        </div>
    );
};

const ChoreGeneratorAssignmentCell: React.FC<StateProps<Array<TenantId>>> = ({
    state,
    setState,
}) => {
    const { user } = useContext(UserContext) as UserContextType;
    const assignees = state
        .map((tenantId) => getTenantByTenantId(user, tenantId))
        .filter((tenant) => tenant) as Tenant[];

    const assigneeNames = assignees.map((tenant) => tenant.name);

    const tenants = user.apartment.tenants;

    const toggleAssign = (tenantId: TenantId) => {
        if (state.includes(tenantId)) {
            const tenantIdIndex = state.indexOf(tenantId);
            state.splice(tenantIdIndex, 1);
            setState(state);
        } else {
            state.push(tenantId);
            setState(state);
        }
    };

    const tenantAssignmentCells = tenants.map((tenant) => (
        <TenantAssignmentCell
            key={tenant.id}
            tenant={tenant}
            assigned={assignees.includes(tenant)}
            toggleAssign={toggleAssign}
        />
    ));
    return (
        <div>
            {assignees.length > 0 ? (
                <p>{'Assigned to ' + formatNames(assigneeNames)}</p>
            ) : (
                <p style={{ fontWeight: 'bold' }}>
                    {
                        'This chore has not yet been assigned to anyone. If left unassigned, it will be automatically assigned to all tenants.'
                    }
                </p>
            )}
            <div style={{ display: 'flex' }}>{tenantAssignmentCells}</div>
        </div>
    );
};

interface TenantAssignmentCellProps {
    tenant: Tenant;
    assigned: boolean;
    toggleAssign: (tenantId: TenantId) => void;
}

const TenantAssignmentCell: React.FC<TenantAssignmentCellProps> = ({
    tenant,
    assigned,
    toggleAssign,
}) => {
    return (
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
            <h3>{tenant.name}</h3>
            <button onClick={() => toggleAssign(tenant.id)}>
                {assigned ? 'Unassign' : 'Assign'}
            </button>
        </div>
    );
};

export default CreateChoreGeneratorCell;
