import React, { useContext, useEffect, useState } from 'react';
import { DateInputCell } from '../../Common/components/DateInputCell';
import Tabs from '../../Common/components/Tabs';
import { UserContext, UserContextType } from '../../Common/context';
import { Tenant, User } from '../../Common/models';
import { StateProps, TenantId } from '../../Common/types';
import {
    assertUnreachable,
    getFormattedDateString,
    getNewId,
    getTenant,
    getYesterdaysDate,
    isFutureDate,
    isPreviousDate,
    isSameDayMonthYear,
} from '../../Common/utilities';
import { formatNames } from '../../Friends/components/FriendSummaryCell';
import { Chore, getChoresFromChoreGenerator } from '../models/Chore';
import { ChoreGenerator, ChoreGeneratorID, frequencies, Frequency } from '../models/ChoreGenerator';

const tabNames = ['Today', 'Upcoming', 'Overview', 'Completed'] as const;
type ChoresTabType = typeof tabNames[number];

//TO DO: Show day of week

// TO DO: normalize dates to have

// TO DO: for upcoming / today's chores, filter by user id too ... it should be only the shit assigned to them?
// should they be able to see if their roomates did shit? i think so... it's more work but worth it

// TO DO: build create cg cell; verify everything

// TO DO: sort by 'assigned to me' or whatever

//TO DO: fix assigned to none ==> assigned to all

const Chores: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const [tab, setTab] = useState<ChoresTabType>('Today');

    const choreGenerators = user.apartment.choresInfo.choreGenerators;
    const chores = user.apartment.choresInfo.chores;

    //So: this works when cG is set to a new array rather than just pushing...
    //very interesting. OK, makes sense. but i can't say i like it. some weird
    //array behavior. I do need to call this so it will generate future ones,
    //but i guess i could just use it the same way i use useEffect.
    useEffect(() => {
        updateChoresFromChoreGenerators(choreGenerators, user, setUser);
    }, [choreGenerators.length]); // ??

    useEffect(() => {
        purgeOldChores(user, setUser);
    });

    const toggleCompleted = (chore: Chore) => {
        const completed = chore.completed;
        chore.completed = !completed;
        setUser({ ...user });
        //TO DO: Save to database
    };

    const handleDeleteChore = (chore: Chore) => {
        const choreIndex = chores.indexOf(chore);
        chores.splice(choreIndex, 1);
        setUser({ ...user });
        //TO DO: Save to database
    };

    const handleDeleteSeries = (cgId: ChoreGeneratorID) => {
        const choresInSeries = chores.filter((chore) => chore.choreGeneratorID === cgId);
        choresInSeries.forEach((chore) => chores.splice(chores.indexOf(chore), 1));
        const cgIndex = choreGenerators.findIndex((cg) => cg.id === cgId);
        choreGenerators.splice(cgIndex, 1);
        setUser({ ...user });
    };

    let content: JSX.Element;

    const now = new Date(Date.now());

    const upcomingDateLimit = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    upcomingDateLimit.setMonth(upcomingDateLimit.getMonth() + 1, upcomingDateLimit.getDate() + 1);

    const getTodaysChores = () =>
        chores
            .filter((chore) => !chore.completed)
            .filter(
                (chore) =>
                    isSameDayMonthYear(chore.date, now) ||
                    (isPreviousDate(chore.date, now) && chore.showUntilCompleted),
            );

    const getUpcomingChores = () =>
        chores
            .filter((chore) => !chore.completed)
            .filter((chore) => isFutureDate(chore.date, now))
            .filter((chore) => chore.date.getTime() < upcomingDateLimit.getTime());
    //.filter((chore) => isFutureDate(chore.date, now))
    //.filter((chore) => chore.date.getTime() < upcomingDateLimit.getTime());

    const getChoreGeneratorCells = () =>
        choreGenerators.map((cg) => (
            <ChoreGeneratorCell
                choreGenerator={cg}
                handleDeleteSeries={handleDeleteSeries}
                assignedToUser={cg.assigneeIds.includes(user.tenantId)}
            />
        ));

    const getCompletedChores = () => chores.filter((chore) => chore.completed);

    const getChoreCell = (chore: Chore) => (
        <ChoreCell
            chore={chore}
            assignedToUser={chore.assigneeIds.includes(user.tenantId)}
            toggleCompleted={toggleCompleted}
            handleDeleteChore={handleDeleteChore}
            handleDeleteSeries={handleDeleteSeries}
        />
    );

    switch (tab) {
        case 'Today':
            content = <div>{getTodaysChores().map(getChoreCell)}</div>;
            break;
        case 'Upcoming':
            content = <div>{getUpcomingChores().map(getChoreCell)}</div>;
            break;
        case 'Overview':
            content = <div>{getChoreGeneratorCells()}</div>;
            break;
        case 'Completed':
            content = <div>{getCompletedChores().map(getChoreCell)}</div>;
            break;
        default:
            assertUnreachable(tab);
    }

    return (
        <div>
            <Tabs currentTab={tab} setTab={setTab} tabNames={tabNames} />
            <CreateChoreGeneratorCell setTab={setTab} />
            <div>{content}</div>
        </div>
    );
};

interface CreateChoreGeneratorInput {
    name: string;
    assigneeIds: TenantId[];
    frequency: Frequency;
    starting: Date;
    showUntilCompleted: boolean;
}

const today = new Date(Date.now());

const initialCreateChoreGeneratorInput: CreateChoreGeneratorInput = {
    name: '',
    assigneeIds: [],
    frequency: 'Daily',
    starting: today,
    showUntilCompleted: false,
};

interface CreateChoreGeneratorCellProps {
    setTab: React.Dispatch<React.SetStateAction<ChoresTabType>>;
}

const CreateChoreGeneratorCell: React.FC<CreateChoreGeneratorCellProps> = ({ setTab }) => {
    const { user, setUser } = useContext(UserContext) as UserContextType;

    const [input, setInput] = useState<CreateChoreGeneratorInput>(initialCreateChoreGeneratorInput);

    const [showCreateChore, setShowCreateChore] = useState(false);

    const handleSetAssigneeIds = (assigneeIds: TenantId[]) => {
        setInput({ ...input, assigneeIds: assigneeIds });
    };

    const handleSetFrequency = (frequency: Frequency) => {
        setInput({ ...input, frequency: frequency });
    };

    const handleSetDate = (date: Date) => {
        setInput({ ...input, starting: new Date(date) });
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
        const assigneeIds: TenantId[] =
            input.assigneeIds.length > 0
                ? input.assigneeIds
                : user.apartment.tenants.map((tenant) => tenant.id);
        const newChoreGenerator: ChoreGenerator = {
            id: getNewId(user.apartment.choresInfo.choreGenerators),
            name: input.name,
            assigneeIds: assigneeIds,
            frequency: input.frequency,
            starting: input.starting,
            showUntilCompleted: input.showUntilCompleted,
            updatedThrough: getYesterdaysDate(),
        };
        user.apartment.choresInfo.choreGenerators.push(newChoreGenerator);
        setInput(initialCreateChoreGeneratorInput);
        setShowCreateChore(false);
        setTab('Overview');
        setUser({ ...user });
    };

    return (
        <div>
            <button onClick={() => setShowCreateChore(!showCreateChore)}>
                {showCreateChore ? 'Cancel' : 'Create New Chore'}
            </button>
            {showCreateChore ? (
                <div>
                    <label>
                        {'Chore Title: '}
                        <input
                            type="text"
                            value={input.name}
                            name="name"
                            onChange={handleChangeName}
                        />
                    </label>
                    <br />
                    <ChoreGeneratorAssignmentCell
                        state={input.assigneeIds}
                        setState={handleSetAssigneeIds}
                    />
                    <FrequencySelectCell state={input.frequency} setState={handleSetFrequency} />
                    <DateInputCell
                        state={input.starting}
                        setState={handleSetDate}
                        showReset={true}
                    />
                    <p>
                        {'Show until completed: '}
                        <span style={{ fontWeight: 'bold' }}>
                            {input.showUntilCompleted ? 'YES' : 'NO'}
                        </span>
                        <button onClick={toggleShowUntilCompleted}>{'Toggle'}</button>
                    </p>
                    <p>
                        {
                            "Note: if the chore is marked 'Show until completed', it will remain in Today's chore list past its date until it is completed. Chores with this option de-selected will be automatically deleted after their date passes."
                        }
                    </p>
                    <button onClick={createChoreGenerator}>{'Create New Chore Series'}</button>
                </div>
            ) : null}
        </div>
    );
};

const FrequencySelectCell: React.FC<StateProps<Frequency>> = ({ state, setState }) => {
    const frequencyOptions = frequencies.map((frequency) => (
        <option value={frequency}>{frequency}</option>
    ));
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFrequency = event.target.value as Frequency;
        setState(selectedFrequency);
    };
    return (
        <div>
            <select value={state} onChange={handleChange}>
                {frequencyOptions}
            </select>
        </div>
    );
};

const ChoreGeneratorAssignmentCell: React.FC<StateProps<Array<TenantId>>> = ({
    state,
    setState,
}) => {
    const { user } = useContext(UserContext) as UserContextType;
    const assignees = state
        .map((tenantId) => getTenant(user, tenantId))
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
                <p>
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
        .map((assignee) => getTenant(user, assignee))
        .filter((assignee) => assignee !== undefined) as Tenant[];
    return (
        <div style={assignedToUser ? { borderLeft: '1px solid red' } : {}}>
            <h3>{chore.name}</h3>
            <h5>{getFormattedDateString(chore.date)}</h5>
            <div>
                <p>
                    {'Assigned to: '}
                    {formatNames(tenantAssignees.map((tenant) => tenant.name))}
                </p>
            </div>
            <p>{'Active until completed: ' + (chore.showUntilCompleted ? 'True' : 'False')}</p>
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

interface ChoreGeneratorCellProps {
    choreGenerator: ChoreGenerator;
    handleDeleteSeries: (cgId: ChoreGeneratorID) => void;
    assignedToUser: boolean;
}

//below: should be getFormattedDateString

const ChoreGeneratorCell: React.FC<ChoreGeneratorCellProps> = ({
    choreGenerator,
    handleDeleteSeries,
    assignedToUser,
}) => {
    const { user } = useContext(UserContext) as UserContextType;
    const tenantAssignees = choreGenerator.assigneeIds
        .map((assignee) => getTenant(user, assignee))
        .filter((assignee) => assignee !== undefined) as Tenant[];
    return (
        <div style={assignedToUser ? { borderLeft: '1px solid red' } : {}}>
            <h3>{choreGenerator.name}</h3>
            <p>
                <span style={{ fontWeight: 'bold' }}>{choreGenerator.frequency}</span>
            </p>
            <p>{'Beginning: ' + getFormattedDateString(choreGenerator.starting)}</p>
            <p>{'Assigned to ' + formatNames(tenantAssignees.map((tenant) => tenant.name))}</p>
            <p>{'Active until completed: ' + (choreGenerator.showUntilCompleted ? 'Yes' : 'No')}</p>
            <button onClick={() => handleDeleteSeries(choreGenerator.id)}>
                {'Delete chore series'}
            </button>
        </div>
    );
};

// Chores will be generated for up to 1 year from now
export const getMaxDate = () => {
    const current = new Date(Date.now());
    const currYear = current.getFullYear();
    current.setFullYear(currYear + 1);
    return current;
};

// Inactive chores will be deleted after they are 1 month old.
const getMinDate = () => {
    const current = new Date(Date.now());
    const currentMonth = current.getMonth();
    current.setMonth(currentMonth - 1);
    return current;
};

const updateChoresFromChoreGenerators = (
    choreGenerators: ChoreGenerator[],
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>,
) => {
    const originalChores = user.apartment.choresInfo.chores;
    const newChores: Chore[] = [];
    choreGenerators.forEach((choreGenerator) => {
        const { updatedThrough } = choreGenerator;
        const generationStartDate = new Date(updatedThrough);
        const currentDate = generationStartDate.getDate();
        generationStartDate.setDate(currentDate + 1);
        const generatedChores = getChoresFromChoreGenerator(
            choreGenerator,
            originalChores.concat(newChores),
            generationStartDate,
        );
        newChores.push(...generatedChores);
        choreGenerator.updatedThrough = getMaxDate(); //does this update successfully?
    });
    if (newChores.length > 0) {
        user.apartment.choresInfo.chores.push(...newChores);
        setUser({ ...user });
        //TO DO: SAVE NEW CHORES TO DATABASE
    }
};

//Chores should be deleted if
// 1) they are AT ALL old, not completed, and showUntilCompleted = false
// 2) They are more than 30 days old and completed
const purgeOldChores = (user: User, setUser: React.Dispatch<React.SetStateAction<User>>) => {
    const existingChores = user.apartment.choresInfo.chores;
    const remainingChores = existingChores.filter(
        (chore) =>
            !isPreviousDate(chore.date, getMinDate()) ||
            (chore.showUntilCompleted === true && chore.completed === false),
    );
    if (remainingChores.length !== existingChores.length) {
        user.apartment.choresInfo.chores = remainingChores;
        setUser({ ...user });
    }
    //TO DO: DELETE CHORES FROM DATABASE
};

export default Chores;
