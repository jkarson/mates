import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import StandardStyledText from '../../../common/components/StandardStyledText';
import Tabs from '../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import {
    getTodaysDate,
    isSameDayMonthYear,
    isPreviousDate,
    isFutureDate,
    assertUnreachable,
} from '../../../common/utilities';
import ChoreCell from '../../mates/Chores/components/ChoreCell';
import ChoreGeneratorCell from '../../mates/Chores/components/ChoreGeneratorCell';
import { Chore, ChoreGeneratorID } from '../../mates/Chores/models/ChoresInfo';
import { ChoresTabType, choresTabNames } from '../../mates/Chores/models/ChoresTabs';
import { demoPurgeOldChores, demoUpdateChoresFromChoreGenerators } from '../utilities';
import DemoCreateChoreGeneratorCell from './DemoCreateChoreGeneratorCell';

const DemoChores: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const [tab, setTab] = useState<ChoresTabType>('Today');
    const [message, setMessage] = useState('');

    const choreGenerators = user.apartment.choresInfo.choreGenerators;
    const chores = user.apartment.choresInfo.chores;

    useLayoutEffect(() => {
        if (getTodaysChores().length > 0) {
            setTab('Today');
            return;
        }
        if (getUpcomingChores().length > 0) {
            setTab('Upcoming');
            return;
        }
        if (getFutureChores().length > 0) {
            setTab('Future');
            return;
        }
        setTab('Create New');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setMessage('');
    }, [tab]);

    useEffect(() => {
        demoUpdateChoresFromChoreGenerators(choreGenerators, user, setUser);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        demoPurgeOldChores(user, setUser);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleCompleted = (chore: Chore) => {
        if (!chore.completed) {
            markChoreCompleted(chore);
        } else {
            markChoreUncompleted(chore);
        }
    };

    const markChoreCompleted = (chore: Chore) => {
        chore.completed = true;
        chore.completedBy = user.userId;
        setUser({ ...user });
        setMessage('Chore marked completed.');
    };

    const markChoreUncompleted = (chore: Chore) => {
        chore.completed = false;
        chore.completedBy = undefined;
        setUser({ ...user });
        setMessage('Chore marked uncompleted.');
    };

    const handleDeleteChore = (chore: Chore) => {
        const choreIndex = chores.findIndex((existingChore) => existingChore._id === chore._id);
        if (choreIndex !== -1) {
            chores.splice(choreIndex, 1);
            setUser({ ...user });
            setMessage('Chore deleted.');
        }
    };

    const handleDeleteChoreSeries = (cgId: ChoreGeneratorID) => {
        const choresToDelete = chores.filter((chore) => chore.choreGeneratorId === cgId);
        choresToDelete.forEach((choreToDelete) => {
            const choreIndex = chores.findIndex((chore) => chore._id === choreToDelete._id);
            if (choreIndex !== -1) {
                chores.splice(choreIndex, 1);
            }
        });
        const choreGeneratorToDeleteIndex = choreGenerators.findIndex(
            (choreGenerator) => choreGenerator._id === cgId,
        );
        if (choreGeneratorToDeleteIndex !== -1) {
            choreGenerators.splice(choreGeneratorToDeleteIndex, 1);
        }
        setUser({ ...user });
        setMessage('Chore series deleted.');
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
            .sort((a, b) => a.date.getTime() - b.date.getTime());

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
                    key={cg._id}
                    choreGenerator={cg}
                    handleDeleteSeries={handleDeleteChoreSeries}
                    assignedToUser={cg.assigneeIds.includes(user.userId)}
                />
            ));

    const getChoreCell = (chore: Chore) => (
        <ChoreCell
            key={chore._id}
            chore={chore}
            assignedToUser={chore.assigneeIds.includes(user.userId)}
            toggleCompleted={toggleCompleted}
            handleDeleteChore={handleDeleteChore}
            handleDeleteSeries={handleDeleteChoreSeries}
        />
    );

    let content: JSX.Element[];
    switch (tab) {
        case 'Today':
            content = getTodaysChores().map(getChoreCell);
            break;
        case 'Upcoming':
            content = getUpcomingChores().map(getChoreCell);
            break;
        case 'Future':
            content = getFutureChores().map(getChoreCell);
            break;
        case 'Summary':
            content = getChoreGeneratorCells();
            break;
        case 'Completed':
            content = getCompletedChores().map(getChoreCell);
            break;
        case 'Create New':
            content = [];
            break;
        default:
            assertUnreachable(tab);
    }

    return (
        <div className="chores-container">
            <div className="chores-tabs-container">
                <Tabs currentTab={tab} setTab={setTab} tabNames={choresTabNames} />
            </div>
            <div className="chores-content-container">
                {tab === 'Create New' ? (
                    <DemoCreateChoreGeneratorCell setTab={setTab} />
                ) : (
                    <>
                        <div className="chores-description-container">
                            <StandardStyledText text={getChoresDescriptionText(tab)} />
                        </div>
                        {message.length === 0 ? null : (
                            <div className="chores-error-container">
                                <RedMessageCell message={message} />
                            </div>
                        )}
                        <div className="chores-content-list-main-content-container">{content}</div>
                    </>
                )}
            </div>
        </div>
    );
};

const getChoresDescriptionText = (tab: ChoresTabType) => {
    switch (tab) {
        case 'Today':
            return "Today's chores, as well as past chores that remain uncompleted. Chores assigned to you will be marked.";
        case 'Upcoming':
            return 'Chores for the upcoming month. Chores assigned to you will be red.';
        case 'Future':
            return 'Chores for the upcoming year. Chores assigned to you will be red.';
        case 'Summary':
            return 'Overview of all chores. Chores assigned to you will be red.';
        case 'Completed':
            return 'Completed chores. Completed chores will be automatically deleted one month past their date. Chores that you completed will be green.';
        case 'Create New':
            return '';
        default:
            assertUnreachable(tab);
    }
};

export default DemoChores;
