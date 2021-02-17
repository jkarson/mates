import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RedMessageCell } from '../../../common/components/ColoredMessageCells';
import StandardStyledText from '../../../common/components/StandardStyledText';
import Tabs from '../../../common/components/Tabs';
import { MatesUserContext, MatesUserContextType } from '../../../common/context';
import {
    getPutOptions,
    getDeleteOptions,
    getTodaysDate,
    isSameDayMonthYear,
    isPreviousDate,
    isFutureDate,
    assertUnreachable,
} from '../../../common/utilities';
import ChoreCell from './components/ChoreCell';
import ChoreGeneratorCell from './components/ChoreGeneratorCell';
import CreateChoreGeneratorCell from './components/CreateChoreGeneratorCell';
import { Chore, ChoreGeneratorID } from './models/ChoresInfo';
import { ChoresTabType, choresTabNames } from './models/ChoresTabs';
import {
    updateChoresFromChoreGenerators,
    purgeOldChores,
    initializeServerChoresInfo,
} from './utilities';
import './Chores.css';

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
    const [serverCallMade, setServerCallMade] = useState(false);

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
        if (message !== 'Sorry, our server seems to be down.') {
            setMessage('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
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
        fetch('mates/markChoreCompleted', options)
            .then((res) =>
                res.json().then((json) => {
                    setServerCallMade(false);
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
                    setMessage('Chore marked completed.');
                }),
            )
            .catch(() => setMessage('Sorry, our server seems to be down.'));
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
                setServerCallMade(false);
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
                setMessage('Chore marked uncompleted.');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const handleDeleteChore = (chore: Chore) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = {
            apartmentId: user.apartment._id,
            choreId: chore._id,
        };
        const options = getDeleteOptions(data);
        fetch('/mates/deleteChore', options)
            .then((res) => res.json())
            .then((json) => {
                setServerCallMade(false);
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
                setMessage('Chore deleted.');
            })
            .catch(() => setMessage('Sorry, our server seems to be down.'));
    };

    const handleDeleteChoreSeries = (cgId: ChoreGeneratorID) => {
        if (serverCallMade) {
            return;
        }
        setServerCallMade(true);
        const data = {
            apartmentId: user.apartment._id,
            choreGeneratorId: cgId,
        };
        const options = getDeleteOptions(data);
        fetch('/mates/deleteChoreSeries', options)
            .then((res) =>
                res.json().then((json) => {
                    setServerCallMade(false);
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
                    setMessage('Chore series deleted.');
                }),
            )
            .catch(() => setMessage('Sorry, our server seems to be down.'));
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

    if (redirect) {
        return <Redirect to="/" />;
    }

    return (
        <div className="chores-container">
            <div className="chores-tabs-container">
                <Tabs currentTab={tab} setTab={setTab} tabNames={choresTabNames} />
            </div>
            <div className="chores-content-container">
                {tab === 'Create New' ? (
                    <CreateChoreGeneratorCell setTab={setTab} />
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

export default Chores;
