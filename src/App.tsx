import React, { useState } from 'react';
import './App.css';
import Bills from './Bills/components/Bills';
import Chores from './Chores/components/Chores';
import Events from './Events/components/Events';
import Friends from './Friends/components/Friends';
import Contacts from './Contacts/components/Contacts';
import Messages from './Messages/components/Messages';
import Profile from './Profile/components/Profile';
import Tabs from './Common/components/Tabs';
import { assertUnreachable } from './Common/utilities';
import { UserContext } from './Common/context';
import { Users } from './Common/constants';

//PICKUP!
/*
    - Events, Bills, and Chores are refactored
    - Refactor remaining modules
    - Identify and fix remaining bugs / todos
    - Incorporate server 




*/

//TO DO: make sure everything is sorted as it should be for display

//note to self: perhaps all database updates can come via setUser, reducing a million endpoints to one.

//TO DO/EXTENSION: Tab notifications. This system may be a bit tricky and will likely involve the server.

const tabNames = [
    'Profile',
    'Bills',
    'Chores',
    'Events',
    'Friends',
    'Contacts',
    'Messages',
] as const;
type AppTabType = typeof tabNames[number];

const App: React.FC = () => {
    const [tab, setTab] = useState<AppTabType>('Profile');

    let currentComponent: React.ReactNode;
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

    const [user, setUser] = useState(Users.Jeremy);

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
            <div className="container">
                <Header />
                <Tabs currentTab={tab} setTab={setTab} tabNames={tabNames} />
                <div className="content">{currentComponent}</div>
            </div>
        </UserContext.Provider>
    );
};

const Header: React.FC = () => (
    <header className="headerContainer">
        <h1 className="header">{'Mates'}</h1>
        <p className="subHeader">{'A place for roommates to do roommate stuff.'}</p>
    </header>
);

export default App;
