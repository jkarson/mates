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
    getNewIds,
    getNextMonthDayIndicesMonthly,
    getNextMonthDayIndicesQuarterly,
    getTenantByTenantId,
    getTodaysDate,
    getYesterdaysDateFromDate,
    isFutureDate,
    isPreviousDate,
    isSameDayMonthYear,
} from '../../Common/utilities';
import { formatNames } from '../../Friends/components/FriendSummaryCell';
import { Chore, ChoreWithoutId } from '../models/Chore';
import {
    ChoreGenerator,
    ChoreGeneratorID,
    choreFrequencies,
    ChoreFrequency,
} from '../models/ChoreGenerator';

//TODO: SEE NOTEBOOK

//todo today chore disappearing

///todo completed highlight? will i know what im talkin abt??? reilly is hot

const tabNames = [
    'Today',
    'Upcoming',
    'Future',
    'Summary',
    'Completed',
    'Create New Chore Set',
] as const;
type ChoresTabType = typeof tabNames[number];

const Chores: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const [tab, setTab] = useState<ChoresTabType>('Today');

    const choreGenerators = user.apartment.choresInfo.choreGenerators;
    const chores = user.apartment.choresInfo.chores;

    //TO DO: futher test the useEffect dependency optimizations
    useEffect(() => {
        updateChoresFromChoreGenerators(choreGenerators, user, setUser);
    }, [choreGenerators.length]);

    useEffect(() => {
        purgeOldChores(user, setUser);
    }, [user]);

    const toggleCompleted = (chore: Chore) => {
        if (!chore.completed) {
            chore.completed = true;
            chore.completedBy = user.tenantId;
        } else {
            chore.completed = false;
            chore.completedBy = undefined;
        }
        setUser({ ...user });
        //TO DO: Save to database
    };

    const handleDeleteChore = (chore: Chore) => {
        const choreIndex = chores.indexOf(chore);
        chores.splice(choreIndex, 1);
        setUser({ ...user });
        //TO DO: Save to database
    };

    const handleDeleteChoreSeries = (cgId: ChoreGeneratorID) => {
        const choresInSeries = chores.filter((chore) => chore.choreGeneratorID === cgId);
        choresInSeries.forEach((chore) => chores.splice(chores.indexOf(chore), 1));
        const cgIndex = choreGenerators.findIndex((cg) => cg.id === cgId);
        choreGenerators.splice(cgIndex, 1);
        setUser({ ...user });
    };

    const upcomingDateLimit = getTodaysDate();
    upcomingDateLimit.setMonth(upcomingDateLimit.getMonth() + 1, upcomingDateLimit.getDate() + 1);

    const getCompletedChores = () => chores.filter((chore) => chore.completed);
    const getUncompletedChores = () => chores.filter((chore) => !chore.completed);

    const getTodaysChores = () =>
        getUncompletedChores()
            .filter(
                (chore) =>
                    isSameDayMonthYear(chore.date, getTodaysDate()) ||
                    (isPreviousDate(chore.date, getTodaysDate()) && chore.showUntilCompleted),
            )
            .sort((a, b) => b.date.getTime() - a.date.getTime());

    const getUpcomingChores = () =>
        getFutureChores()
            .filter((chore) => isPreviousDate(chore.date, upcomingDateLimit))
            .sort((a, b) => a.date.getTime() - b.date.getTime());

    const getFutureChores = () =>
        getUncompletedChores()
            .filter((chore) => isFutureDate(chore.date, getTodaysDate()))
            .sort((a, b) => a.date.getTime() - b.date.getTime());

    const getChoreGeneratorCells = () =>
        choreGenerators
            .sort((a, b) => a.starting.getTime() - b.starting.getTime())
            .map((cg) => (
                <ChoreGeneratorCell
                    key={cg.id}
                    choreGenerator={cg}
                    handleDeleteSeries={handleDeleteChoreSeries}
                    assignedToUser={cg.assigneeIds.includes(user.tenantId)}
                />
            ));

    const getChoreCell = (chore: Chore) => (
        <ChoreCell
            key={chore.id}
            chore={chore}
            assignedToUser={chore.assigneeIds.includes(user.tenantId)}
            toggleCompleted={toggleCompleted}
            handleDeleteChore={handleDeleteChore}
            handleDeleteSeries={handleDeleteChoreSeries}
        />
    );

    let content: JSX.Element;
    switch (tab) {
        case 'Today':
            content = <div>{getTodaysChores().map(getChoreCell)}</div>;
            break;
        case 'Upcoming':
            content = <div>{getUpcomingChores().map(getChoreCell)}</div>;
            break;
        case 'Future':
            content = <div>{getFutureChores().map(getChoreCell)}</div>;
            break;
        case 'Summary':
            content = <div>{getChoreGeneratorCells()}</div>;
            break;
        case 'Completed':
            content = <div>{getCompletedChores().map(getChoreCell)}</div>;
            break;
        case 'Create New Chore Set':
            content = <CreateChoreGeneratorCell setTab={setTab} />;
            break;
        default:
            assertUnreachable(tab);
    }

    return (
        <div>
            <Tabs currentTab={tab} setTab={setTab} tabNames={tabNames} />
            <DescriptionCell tab={tab} />
            <div>{content}</div>
        </div>
    );
};

interface DescriptionCellProps {
    tab: ChoresTabType;
}

const DescriptionCell: React.FC<DescriptionCellProps> = ({ tab }) => {
    let content: string;
    switch (tab) {
        case 'Today':
            content = "Today's chores. Chores assigned to you will be highlighted in red.";
            break;
        case 'Upcoming':
            content =
                'Chores for the upcoming month. Chores assigned to you will be highlighted in red.';
            break;
        case 'Future':
            content =
                'Chores for the upcoming year. Chores assigned to you will be highlighted in red.';
            break;
        case 'Summary':
            content = 'Overview of all chores. Chores assigned to you will be highlighted in red.';
            break;
        case 'Completed':
            content =
                'Completed chores. Completed chores will be automatically deleted one month past their date. Chores that you completed will be highlighted in red.';
            break;
        case 'Create New Chore Set':
            content = '';
            break;
        default:
            assertUnreachable(tab);
    }
    return <p style={{ fontWeight: 'bold' }}>{content}</p>;
};

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
            <FrequencySelectCell state={input.frequency} setState={handleSetFrequency} />
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
//TO DO: refactor into common component w bills one?
const FrequencySelectCell: React.FC<StateProps<ChoreFrequency>> = ({ state, setState }) => {
    const frequencyOptions = choreFrequencies.map((frequency, index) => (
        <option value={frequency} key={index}>
            {frequency}
        </option>
    ));
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFrequency = event.target.value as ChoreFrequency;
        setState(selectedFrequency);
    };
    return (
        <div>
            <label>
                {'Repeat: '}
                <select value={state} onChange={handleChange}>
                    {frequencyOptions}
                </select>
            </label>
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

//TO DO: This is used in Bills, should be in utilities
// Chores will be generated for up to 1 year from now
export const getMaxDate = () => {
    const current = getTodaysDate();
    const currYear = current.getFullYear();
    current.setFullYear(currYear + 1);
    current.setDate(current.getDate() + 1);
    return current;
};

// Completed chores will be deleted after they are 1 month old.
const getMinDate = () => {
    const current = getTodaysDate();
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

    // Only update user if user actually needs to be updated. This protects
    // against an infinite update loop.
    if (
        choreGenerators.filter((chore) => !isSameDayMonthYear(chore.updatedThrough, getMaxDate()))
            .length === 0
    ) {
        return;
    }

    choreGenerators.forEach((choreGenerator) => {
        const { updatedThrough } = choreGenerator;
        const generationStartDate = new Date(updatedThrough.getTime());
        generationStartDate.setDate(generationStartDate.getDate() + 1);
        const generatedChores = getChoresFromChoreGenerator(
            choreGenerator,
            originalChores.concat(newChores),
            generationStartDate,
        );
        newChores.push(...generatedChores);
        choreGenerator.updatedThrough = getMaxDate();
    });
    user.apartment.choresInfo.chores.push(...newChores);
    setUser({ ...user });
    //TO DO: SAVE NEW CHORES TO DATABASE
};

const purgeOldChores = (user: User, setUser: React.Dispatch<React.SetStateAction<User>>) => {
    const existingChores = user.apartment.choresInfo.chores;
    const deletionIndices: number[] = [];

    existingChores.forEach((chore, index) => {
        if (
            (isPreviousDate(chore.date, getTodaysDate()) &&
                !chore.completed &&
                !chore.showUntilCompleted) ||
            (isPreviousDate(chore.date, getMinDate()) && chore.completed)
        ) {
            deletionIndices.push(index);
        }
    });

    deletionIndices.forEach((index) => {
        existingChores.splice(index, 1);
    });

    if (deletionIndices.length > 0) {
        //TO DO: Save deletions to database
        setUser({ ...user });
    }
};

const getChoresFromChoreGenerator = (
    choreGenerator: ChoreGenerator,
    previousChores: Chore[],
    generationStartDate: Date,
): Chore[] => {
    const choresWithoutId = getChoresWithoutIdFromChoreGenerator(
        choreGenerator,
        generationStartDate,
    );
    const newIds = getNewIds(previousChores, choresWithoutId.length);
    const chores: Chore[] = [];
    choresWithoutId.forEach((chore, index) => chores.push({ ...chore, id: newIds[index] }));
    return chores;
};

const getChoresWithoutIdFromChoreGenerator = (
    { id, name, assigneeIds, showUntilCompleted, frequency, starting }: ChoreGenerator,
    generationStartDate: Date,
): ChoreWithoutId[] => {
    const choreDates = getDates(starting, generationStartDate, frequency);
    return choreDates.map((date) => {
        return {
            choreGeneratorID: id,
            name: name,
            assigneeIds: [...assigneeIds],
            showUntilCompleted: showUntilCompleted,
            completed: false,
            date: date,
        };
    });
};

const getDates = (starting: Date, generationStartDate: Date, frequency: ChoreFrequency): Date[] => {
    const dates: Date[] = [];

    let dateIterator = new Date(starting.getTime());
    const maxDate = getMaxDate();
    loop1: while (isPreviousDate(dateIterator, maxDate)) {
        if (!isPreviousDate(dateIterator, generationStartDate)) {
            dates.push(new Date(dateIterator.getTime()));
        }
        switch (frequency) {
            case 'Daily':
                dateIterator.setDate(dateIterator.getDate() + 1);
                break;
            case 'Weekly':
                dateIterator.setDate(dateIterator.getDate() + 7);
                break;
            case 'Monthly':
                dateIterator.setMonth(...getNextMonthDayIndicesMonthly(dateIterator));
                break;
            case 'Quarterly':
                dateIterator.setMonth(...getNextMonthDayIndicesQuarterly(dateIterator));
                break;
            case 'Yearly':
                dateIterator.setFullYear(dateIterator.getFullYear() + 1);
                break;
            case 'Once':
                break loop1;
            default:
                assertUnreachable(frequency);
        }
    }
    return dates;
};

export default Chores;
