import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import DescriptionCell from '../../../../common/components/DescriptionCell';
import Tabs from '../../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../../common/context';
import {
    getTodaysDate,
    isSameDayMonthYear,
    isPreviousDate,
    isFutureDate,
    assertUnreachable,
    getPutOptions,
    getDeleteOptions,
} from '../../../../common/utilities';
import { Chore, ChoreGeneratorID } from '../models/ChoresInfo';
import { ChoresTabType, choresTabNames } from '../models/ChoresTabs';
import {
    updateChoresFromChoreGenerators,
    purgeOldChores,
    initializeServerChoresInfo,
} from '../utilities';
import ChoreCell from './ChoreCell';
import ChoreGeneratorCell from './ChoreGeneratorCell';
import CreateChoreGeneratorCell from './CreateChoreGeneratorCell';

//EXTENSION: Optimize useEffect calls w/ dependency arrays

//EXTENSION: Consider adding private chores
//EXTENSION: consider adding 'Overdue' chores
//EXTENSION: consider adding a "Your Chores" section or other analytics to the Summary tab

const Chores: React.FC = () => {
    const { matesUser: user, setMatesUser: setUser } = useContext(
        MatesUserContext,
    ) as MatesUserContextType;
    const [tab, setTab] = useState<ChoresTabType>('Today');
    const [redirect, setRedirect] = useState(false);
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
    }, []);

    useEffect(() => {
        setMessage('');
    }, [tab]);

    useEffect(() => {
        const unauthenticated = updateChoresFromChoreGenerators(choreGenerators, user, setUser);
        if (unauthenticated) {
            setRedirect(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const unauthenticated = purgeOldChores(user, setUser);
        if (unauthenticated) {
            setRedirect(true);
        }
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
        const data = {
            userId: user.userId,
            apartmentId: user.apartment._id,
            choreId: chore._id,
        };
        const options = getPutOptions(data);
        fetch('mates/markChoreCompleted', options).then((res) =>
            res.json().then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, the chore could not be marked completed at this time');
                    return;
                }
                const { choresInfo } = json;
                const formattedChoresInfo = initializeServerChoresInfo(choresInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, choresInfo: formattedChoresInfo },
                });
                setMessage('Chore Marked Completed');
            }),
        );
    };

    const markChoreUncompleted = (chore: Chore) => {
        const data = {
            apartmentId: user.apartment._id,
            choreId: chore._id,
        };
        const options = getPutOptions(data);
        fetch('/mates/markChoreUncompleted', options)
            .then((res) => res.json())
            .then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, the chore could not be marked uncompleted at this time');
                    return;
                }
                const { choresInfo } = json;
                const formattedChoresInfo = initializeServerChoresInfo(choresInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, choresInfo: formattedChoresInfo },
                });
                setMessage('Chore Marked Uncompleted');
            });
    };

    const handleDeleteChore = (chore: Chore) => {
        const data = {
            apartmentId: user.apartment._id,
            choreId: chore._id,
        };
        const options = getDeleteOptions(data);
        fetch('/mates/deleteChore', options)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, the chore could not be deleted at this time.');
                    return;
                }
                const { choresInfo } = json;
                const formattedChoresInfo = initializeServerChoresInfo(choresInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, choresInfo: formattedChoresInfo },
                });
                setMessage('Chore Deleted');
            });
    };

    const handleDeleteChoreSeries = (cgId: ChoreGeneratorID) => {
        const data = {
            apartmentId: user.apartment._id,
            choreGeneratorId: cgId,
        };
        console.log('hi from handle delete chore series. data:');
        console.log(data);
        const options = getDeleteOptions(data);
        fetch('/mates/deleteChoreSeries', options).then((res) =>
            res.json().then((json) => {
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setMessage('Sorry, the chore series could not be deleted at this time');
                    return;
                }
                const { choresInfo } = json;
                const formattedChoresInfo = initializeServerChoresInfo(choresInfo);
                setUser({
                    ...user,
                    apartment: { ...user.apartment, choresInfo: formattedChoresInfo },
                });
                setMessage('Chore Series Deleted');
            }),
        );
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

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div>
            <Tabs currentTab={tab} setTab={setTab} tabNames={choresTabNames} />
            <ChoresDescriptionCell tab={tab} />
            {message.length === 0 ? null : <p style={{ color: 'red' }}>{message}</p>}
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
            content =
                "Today's chores, as well as past chores that remain uncompleted. Chores assigned to you will be highlighted in red.";
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
