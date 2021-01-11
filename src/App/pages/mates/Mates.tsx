import React, { useLayoutEffect, useState } from 'react';
import './Mates.css';
import Bills from './Bills/components/Bills';
import Chores from './Chores/components/Chores';
import Events from './Events/components/Events';
import Friends from './Friends/components/Friends';
import Contacts from './Contacts/components/Contacts';
import Messages from './Messages/components/Messages';
import Profile from './Profile/components/Profile';
import Tabs from '../../common/components/Tabs';
import { MatesUserContext } from '../../common/context';
import {
    assertUnreachable,
    //formatFriendsInfo,
    initializeDates,
    //markManuallyAddedContacts,
} from '../../common/utilities';
import PageCell from '../../common/components/PageCell';
import { matesTabNames, MatesTabType } from './MatesTabs';
import { Apartment, MatesUser } from '../../common/models';
import { Redirect } from 'react-router-dom';
import { initializeServerMessages } from './Messages/utilities';
import { initializeServerBillsInfo } from './Bills/utilities';
import { initializeServerContacts } from './Contacts/utilities';
import { initializeServerFriendsInfo } from './Friends/utilities';
import { initializeServerChoresInfo } from './Chores/utilities';
import { initializeServerEventsInfo } from './Events/utilities';

//PICKUP!
/*
    - Events, Bills, and Chores are refactored (done)
    - Refactor Contacts (done), Friends (done), Messages (done), Profile (done), and Common (done)
    - Identify and fix remaining bugs / todos
    - Incorporate server
*/

//note to self: perhaps all database updates can come via setUser, reducing a million endpoints to one.

//TO DO/EXTENSION: Tab notifications. This system may be a bit tricky and will likely involve the server.

const Mates: React.FC = () => {
    const [tab, setTab] = useState<MatesTabType>('Profile');
    const [matesUser, setMatesUser] = useState<MatesUser | null>(null);
    const [redirect, setRedirect] = useState(false);
    const [accountRedirect, setAccountRedirect] = useState(false);

    useLayoutEffect(() => {
        fetch('/mates')
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                const { authenticated, success } = json;
                if (!authenticated) {
                    setRedirect(true);
                    return;
                }
                if (!success) {
                    setAccountRedirect(true);
                    return;
                }
                const { userId, apartment } = json;
                const formattedApartment = initialize(apartment);
                console.log('setting mates user...');
                console.log(json);
                setMatesUser({ userId: userId, apartment: apartment });
            });
    }, []);

    let currentComponent: JSX.Element | undefined;
    switch (tab) {
        case 'Bills':
            currentComponent = <Bills />;
            break;
        case 'Chores':
            currentComponent = <Chores />;
            break;
        case 'Events':
            currentComponent = <Events />;
            break;
        case 'Friends':
            currentComponent = <Friends />;
            break;
        case 'Contacts':
            currentComponent = <Contacts />;
            break;
        case 'Messages':
            currentComponent = <Messages />;
            break;
        case 'Profile':
            currentComponent = <Profile />;
            break;
        default:
            assertUnreachable(tab);
    }

    if (redirect) {
        return <Redirect to="/" />;
    }
    if (accountRedirect) {
        return <Redirect to="/account" />;
    }
    if (!matesUser) {
        return null;
    }

    return (
        <MatesUserContext.Provider
            value={{
                matesUser: matesUser,
                setMatesUser: setMatesUser as React.Dispatch<React.SetStateAction<MatesUser>>,
            }}
        >
            <PageCell
                tabs={<Tabs currentTab={tab} setTab={setTab} tabNames={matesTabNames} />}
                content={currentComponent}
            />
        </MatesUserContext.Provider>
    );
};

//TO DO: this will expand in scope... maybe we can opt out of types for it,
// or put them in later. it's the type of helper method we want to avoid,
//but for expediency we're using it rather brashly for now
const initialize = (apartment: any): void => {
    initializeServerMessages(apartment.messages);
    initializeServerBillsInfo(apartment.billsInfo);
    initializeServerChoresInfo(apartment.choresInfo);
    initializeServerContacts(apartment.manuallyAddedContacts);
    initializeServerFriendsInfo(apartment.friendsInfo);
    initializeServerEventsInfo(apartment.eventsInfo);
    return;
};

export default Mates;
