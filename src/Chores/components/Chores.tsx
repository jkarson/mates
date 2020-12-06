import React, { useContext, useEffect, useState } from 'react';
import DescriptionCell from '../../Common/components/DescriptionCell';
import Tabs from '../../Common/components/Tabs';
import { UserContext, UserContextType } from '../../Common/context';
import {
    assertUnreachable,
    getTodaysDate,
    isFutureDate,
    isPreviousDate,
    isSameDayMonthYear,
} from '../../Common/utilities';
import { Chore } from '../models/Chore';
import { ChoreGeneratorID } from '../models/ChoreGenerator';
import { ChoresTabType, choresTabNames } from '../models/ChoresTabs';
import { updateChoresFromChoreGenerators, purgeOldChores } from '../utilities';
import ChoreCell from './ChoreCell';
import ChoreGeneratorCell from './ChoreGeneratorCell';
import CreateChoreGeneratorCell from './CreateChoreGeneratorCell';

//EXTENSION: Optimize useEffect calls w/ dependency arrays

//EXTENSION: Consider adding private chores
//EXTENSION: consider adding 'Overdue' chores
//EXTENSION: consider adding a "Your Chores" section or other analytics to the Summary tab

const Chores: React.FC = () => {
    const { user, setUser } = useContext(UserContext) as UserContextType;
    const [tab, setTab] = useState<ChoresTabType>('Today');

    const choreGenerators = user.apartment.choresInfo.choreGenerators;
    const chores = user.apartment.choresInfo.chores;

    useEffect(() => {
        updateChoresFromChoreGenerators(choreGenerators, user, setUser);
    });

    useEffect(() => {
        purgeOldChores(user, setUser);
    });

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
        case 'Create New':
            content = <CreateChoreGeneratorCell setTab={setTab} />;
            break;
        default:
            assertUnreachable(tab);
    }

    return (
        <div>
            <Tabs currentTab={tab} setTab={setTab} tabNames={choresTabNames} />
            <ChoresDescriptionCell tab={tab} />
            <div>{content}</div>
        </div>
    );
};

interface ChoresDescriptionCellProps {
    tab: ChoresTabType;
}

const ChoresDescriptionCell: React.FC<ChoresDescriptionCellProps> = ({ tab }) => {
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
        case 'Create New':
            content = '';
            break;
        default:
            assertUnreachable(tab);
    }
    return <DescriptionCell content={content} />;
};

export default Chores;
