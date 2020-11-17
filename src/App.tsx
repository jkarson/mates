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

//TO DO: make sure everything is sorted as it should be for display

//TO DO: If I could build forms into a common component... it would be a lot of work to refactor but would make
//implementation so much cleaner and quicker

//TO DO: Make sure Contacts, Whiteboard, Friends, Events update 'back-end' data values as needed;
//implement bills and chores
//implement back-end
//implement style

//note to self: probably every time setUser is called, the database needs to be updated.
//when our front-end data
//changes, our back end data must change too

//TO DO:

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

    //NOTE TO SELF: if we want everything to run through the database, make our setUser
    //instead include the call to the database, and then set the user to the database's result.
    //of course, i've put all the logic here in javascript, so idrk

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
