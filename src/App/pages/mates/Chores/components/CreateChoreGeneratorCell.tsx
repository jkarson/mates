import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import DateInputCell from '../../../../common/components/DateInputCell';
import FrequencySelectCell from '../../../../common/components/FrequencySelectCell';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import { Tenant, UserId } from '../../../../common/models';
import { StateProps } from '../../../../common/types';
import {
    getTodaysDate,
    getYesterdaysDateFromDate,
    getTenantByTenantId,
    formatNames,
    getMaxDate,
    getPostOptions,
} from '../../../../common/utilities';
import { choreFrequencies, ChoreFrequency } from '../models/ChoreFrequency';
import { ChoreGeneratorWithoutId, ChoreWithoutId } from '../models/ChoresInfo';
import { ChoresTabType } from '../models/ChoresTabs';
import {
    getChoresWithoutIdFromChoreGeneratorWithoutId,
    initializeServerChoresInfo,
} from '../utilities';

interface CreateChoreGeneratorInput {
    name: string;
    assigneeIds: UserId[];
    frequency: ChoreFrequency;
    starting: Date;
    showUntilCompleted: boolean;
}

interface CreateChoreGeneratorCellProps {
    setTab: React.Dispatch<React.SetStateAction<ChoresTabType>>;
}

const CreateChoreGeneratorCell: React.FC<CreateChoreGeneratorCellProps> = ({ setTab }) => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;

    const [redirect, setRedirect] = useState(false);
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
        const newChoreGenerator: ChoreGeneratorWithoutId = {
            name: input.name,
            assigneeIds: [...assigneeIds],
            frequency: input.frequency,
            starting: starting,
            showUntilCompleted: input.showUntilCompleted,
            updatedThrough: getYesterdaysDateFromDate(starting),
        };
        const generatedChores: ChoreWithoutId[] = getChoresWithoutIdFromChoreGeneratorWithoutId(
            newChoreGenerator,
        );
        newChoreGenerator.updatedThrough = getMaxDate();
        const data = {
            apartmentId: user.apartment._id,
            newChoreGenerator: newChoreGenerator,
            generatedChores: generatedChores,
        };
        const options = getPostOptions(data);
        fetch('/mates/createChoreGenerator', options)
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setError('Sorry, the chore series could not be created');
                    return;
                }

                const { choresInfo } = json;
                const formattedChoresInfo = initializeServerChoresInfo(choresInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, choresInfo: formattedChoresInfo },
                });
                setInput({
                    name: '',
                    assigneeIds: [],
                    frequency: 'Daily',
                    starting: getTodaysDate(),
                    showUntilCompleted: true,
                });
                setError('');
                setTab('Summary');
            });
    };

    if (redirect) {
        return <Redirect to="/" />;
    }

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

export default CreateChoreGeneratorCell;
