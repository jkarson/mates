import React, { useContext, useState } from 'react';
import DateInputCell from '../../../common/components/DateInputCell';
import FrequencySelectCell from '../../../common/components/FrequencySelectCell';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import { UserId, Tenant } from '../../../common/models';
import { StateProps } from '../../../common/types';
import {
    getTodaysDate,
    getYesterdaysDateFromDate,
    getMaxDate,
    getTenantByTenantId,
    formatNames,
} from '../../../common/utilities';
import { ChoreFrequency, choreFrequencies } from '../../mates/Chores/models/ChoreFrequency';
import { Chore, ChoreGenerator, ChoreWithoutId } from '../../mates/Chores/models/ChoresInfo';
import { ChoresTabType } from '../../mates/Chores/models/ChoresTabs';
import { getChoresWithoutIdFromChoreGenerator } from '../../mates/Chores/utilities';
import { getNewId, getNewIds } from '../utilities';

interface CreateChoreGeneratorInput {
    name: string;
    assigneeIds: UserId[];
    frequency: ChoreFrequency;
    starting: Date;
    showUntilCompleted: boolean;
}

interface DemoCreateChoreGeneratorCellProps {
    setTab: React.Dispatch<React.SetStateAction<ChoresTabType>>;
}

const DemoCreateChoreGeneratorCell: React.FC<DemoCreateChoreGeneratorCellProps> = ({ setTab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [error, setError] = useState('');

    const initialCreateChoreGeneratorInput: CreateChoreGeneratorInput = {
        name: '',
        assigneeIds: [],
        frequency: 'Daily',
        starting: getTodaysDate(),
        showUntilCompleted: true,
    };

    const [input, setInput] = useState<CreateChoreGeneratorInput>(initialCreateChoreGeneratorInput);

    const handleSetAssigneeIds = (assigneeIds: UserId[]) => {
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
        const assigneeIds: UserId[] =
            input.assigneeIds.length > 0
                ? input.assigneeIds
                : user.apartment.tenants.map((tenant) => tenant.userId);
        const starting = new Date(input.starting.getTime());
        const newChoreGenerator: ChoreGenerator = {
            _id: getNewId(user.apartment.choresInfo.choreGenerators, '_id'),
            name: input.name,
            assigneeIds: [...assigneeIds],
            frequency: input.frequency,
            starting: starting,
            showUntilCompleted: input.showUntilCompleted,
            updatedThrough: getYesterdaysDateFromDate(starting),
        };
        const generatedChores: ChoreWithoutId[] = getChoresWithoutIdFromChoreGenerator(
            newChoreGenerator,
        );
        const newIds = getNewIds(user.apartment.choresInfo.chores, '_id', generatedChores.length);
        const newChores: Chore[] = generatedChores.map((chore, index) => {
            return { ...chore, _id: newIds[index] };
        });
        newChoreGenerator.updatedThrough = getMaxDate();
        user.apartment.choresInfo.choreGenerators.push(newChoreGenerator);
        user.apartment.choresInfo.chores = user.apartment.choresInfo.chores.concat(newChores);
        setUser({ ...user });
        setInput({
            name: '',
            assigneeIds: [],
            frequency: 'Daily',
            starting: getTodaysDate(),
            showUntilCompleted: true,
        });
        setError('');
        setTab('Summary');
    };

    return (
        <div>
            {error.length === 0 ? null : <p style={{ color: 'red' }}>{error}</p>}
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
                {input.showUntilCompleted
                    ? 'These chores will remain in your chore list until they are completed, even if their date passes.'
                    : 'These chores will be automatically deleted when their date passes, whether or not they have been completed.'}
            </p>
            <button onClick={createChoreGenerator}>{'Create Chore Set'}</button>
        </div>
    );
};

const ChoreGeneratorAssignmentCell: React.FC<StateProps<Array<UserId>>> = ({ state, setState }) => {
    const { matesUser: user } = useContext(MatesUserContext) as MatesUserContextType;
    const assignees = state
        .map((tenantId) => getTenantByTenantId(user, tenantId))
        .filter((tenant) => tenant) as Tenant[];

    const assigneeNames = assignees.map((tenant) => tenant.name);

    const tenants = user.apartment.tenants;

    const toggleAssign = (tenantId: UserId) => {
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
            key={tenant.userId}
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
    toggleAssign: (tenantId: UserId) => void;
}

const TenantAssignmentCell: React.FC<TenantAssignmentCellProps> = ({
    tenant,
    assigned,
    toggleAssign,
}) => {
    return (
        <div style={{ paddingLeft: 20, paddingRight: 20 }}>
            <h3>{tenant.name}</h3>
            <button onClick={() => toggleAssign(tenant.userId)}>
                {assigned ? 'Unassign' : 'Assign'}
            </button>
        </div>
    );
};

export default DemoCreateChoreGeneratorCell;
